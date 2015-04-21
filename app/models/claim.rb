
require "#{Rails.root}/lib/record_builder.rb"

class Claim < ActiveRecord::Base
  CONSULT_TYPES = %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er special_er special_non_er on_call_admission_er on_call_admission_non_er]
  CONSULT_PREMIUM_VISITS = %w[weekday_office_hours weekday_day weekday_evening weekday_night weekend_day weekend_night holiday_day holiday_night calculate]

  enum status: {
    saved: 0,
    for_agent: 1,
    ready: 2,
    file_created: 3,
#    uploaded: 4,
#    acknowledged: 5,
    agent_attention: 6,
    doctor_attention: 7,
    done: 8,
    reclaimed: 9
  }

  scope :submitted, -> { where(status: statuses.except("saved", "doctor_attention").values) }

  scope :include_comment_counts, ->(user_id) { select("(SELECT COUNT(DISTINCT claim_comments.id) FROM claim_comments WHERE claim_comments.read = 'f' AND claim_comments.claim_id = claims.id AND claim_comments.user_id != '#{user_id}') AS unread_comments") }

  scope :include_submission_status, -> {joins("LEFT OUTER JOIN claim_files ON claims.id = claim_files.claim_id AND claim_files.type = 'Submission'").joins("LEFT OUTER JOIN edt_files ON edt_files.type = 'Submission' AND claim_files.edt_file_id = edt_files.id AND claim_files.claim_id = claims.id").select("edt_files.id as submission_id, edt_files.status as submission_status")}

  scope :include_user_name, -> {joins(:user).select("users.name as user_name")}

  belongs_to :user, inverse_of: :claims
  belongs_to :photo, inverse_of: :claim
  has_many :comments, inverse_of: :claim

  has_many :files, through: :claim_files, class_name: "EdtFile", source: :edt_file, inverse_of: :claims
  has_many :claim_files, inverse_of: :claim

  belongs_to :original, class_name: "Claim", inverse_of: :reclamation
  has_one :reclamation, class_name: "Claim", foreign_key: :original_id, inverse_of: :original

  before_validation do
    if details_changed?
      self.total_fee = details['daily_details'].reduce(0) do |sum, dets|
        sum += (dets['fee'] || 0) + (dets['premiums'] || []).reduce(0) do |sum2, prem|
          sum2 += (prem['fee'] || 0)
        end
      end
    end
  end

  def from_record(record)
    details_will_change!
    if record['Health Number'] != 0
      details['patient_number'] = record['Health Number'].to_s+record['Version Code']
      details['patient_birthday'] = record["Patient's Birthdate"]
      details['patient_province'] = "ON"
    else
      details['patient_birthday'] = record["Patient's Birthdate"]
      # the rest will be on the RMB record
    end
    details['hospital'] = record['Master Number']
    details['payment_program'] = record['Payment Program']
    details['payee'] = record['Payee']
    details['referring_physician'] = record['Referring Health Care Provider Number']
    details['service_location'] = record['Service Location Indicator']
    details['manual_review_indicator'] = record['Manual Review Indicator']
    details['referring_laboratory'] = record['Referring Laboratory License Number']
    details['admission_on'] = record["In-Patient Admission Date"].strftime("%Y-%m-%d") if record["In-Patient Admission Date"]
    self.number = record["Accounting Number"].to_i
    details['daily_details'] = []
    self.status = 'file_created'
    self
  end

  def process_rmb_record(record)
    details_will_change!
    details['patient_name'] = record["Patient's First Name"].titleize + ' ' + record["Patient's Last Name"].titleize
    details['patient_number'] = record['Registration Number']
    details['patient_sex'] = record["Patient's Sex"].to_i == 1 ? 'M' : 'F'
    details['patient_province'] = record["Province Code"]
  end

  def process_item(record)
    details_will_change!
    details['daily_details'] << {
      "code" => record['Service Code'],
      "fee" => record['Fee Submitted'],
      "units" => record['Number of Services'],
      "day" => record['Service Date'].strftime("%Y-%m-%d"),
    }
    self.submitted_fee += record['Fee Submitted']
  end

  # assumption is that submission with lowest status is the 'right' one
  def submission
    min_status = 99999
    sub = nil
    files.submissions.each do |file|
      if EdtFile.statuses[file.status] < min_status
        min_status = EdtFile.statuses[file.status]
        sub = file
      end
    end
    sub
  end

  def service_date
    details['first_seen_on'] || (details['daily_details'].first || {"day": nil})["day"]
  end

  # we get information like total fee from the batch files rather than
  # calculating it because these calculations can change over time
  # so make sure a claim is never changed after it is submitted.   If
  # you need to change a claim, clone it first
  def submitted_details
    return @submitted_details if @submitted_details

    @submitted_details = { 'daily_details' => [] }
    if submission
      records = submission.claim_records(self)
    else
      return { 'daily_details' => [] }
    end

    records.each do |record|
      if record.kind_of?(ClaimHeaderRecord) || record.kind_of?(ClaimHeaderRMBRecord)
        @submitted_details.merge!(record.fields)
      elsif record.kind_of?(ItemRecord)
        found = false
        items.each_with_index do |item, i|
          if item[:day] == record['Service Date']
            if item[:code] == record['Service Code']
              @submitted_details['daily_details'][i] = record.fields
              @submitted_details['daily_details'][i]['premiums'] = []
              found = true
            else
              item[:premiums].each_with_index do |premium, j|
                if premium[:code] == record['Service Code']
                  @submitted_details['daily_details'][i]['premiums'][j] = record.fields
                  found = true
                end
              end
            end
          end
        end
        if !found
          raise "FIXME"
        end
      end
    end

    @submitted_details
  end

  def remittance_advice
    files.remittance_advices.order("created_at").last
  end

  def remittance_details
    return @remittance_details if @remittance_details
    return nil if remittance_advice.nil?
    @remittance_details = remittance_advice.claim_details(self)
  end

  # daily_details, normalized, and with a better name
  def items
    details['daily_details'].map do |daily|
      if daily['code']
        code = daily['code'][0..4].upcase
        code[4]='A' if !code[4] || !'ABC'.include?(code[4])
      else
        code = 'Z999A'
      end
      { code: code,
        day: Date.strptime(daily['day']),
        fee: BigDecimal(daily['fee'] || 0) / BigDecimal(100),
        units: daily['units'],
        message: daily['message'],
        diagnosis: daily['diagnosis'] && daily['diagnosis'].strip.split(' ').last,
        premiums: (daily['premiums'] || []).map do |premium|
          if premium['code']
            code = premium['code'][0..4].upcase
            code[4]='A' if !code[4] || !'ABC'.include?(code[4])
          else
            code = 'Z999A'
          end
          { code: code,
            fee: BigDecimal(premium['fee'] || 0) / BigDecimal(100),
            units: premium['units'],
            message: premium['message'],
          }
        end
      }
    end
  end

  def reclaim!
    claim = dup
    claim.user = user
    claim.photo = photo
    claim.status = 'for_agent'
    claim.number = Claim.all.maximum(:number).to_i.succ
    claim.original = self
    claim.submitted_fee = 0
    claim.paid_fee = 0
    self.status = 'reclaimed'
    self.save!
    details['daily_details'].each do |item|
      item.delete('paid')
      item.delete('message')
      (item['premiums'] || []).each do |premium|
        premium.delete('paid')
        premium.delete('message')
      end
    end
    claim.save!
    claim
  end
end
