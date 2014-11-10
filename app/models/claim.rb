
require "#{Rails.root}/lib/record_builder.rb"

class Claim < ActiveRecord::Base
  CONSULT_TYPES = %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er special_er special_non_er on_call_admission_er on_call_admission_non_er]
  CONSULT_PREMIUM_VISITS = %w[weekday_office_hours weekday_day weekday_evening weekday_night weekend_day weekend_night holiday_day holiday_night]

  enum status: %i[saved for_agent ready file_created uploaded acknowledged agent_attention doctor_attention done reclaimed]

  NEXT_STATUSES = {
    "saved" =>          %w[saved for_agent ready],
    "for_agent" =>      %w[for_agent ready doctor_attention done],
    "ready" =>          %w[for_agent ready doctor_attention done reclaimed],
    "file_created" =>   %w[file_created uploaded acknowledged agent_attention done],
    "uploaded" =>       %w[uploaded acknowledged agent_attention done],
    "acknowledged" =>   %w[acknowledged agent_attention done],
    "agent_attention" =>%w[agent_attention done reclaimed],
    "doctor_attention"=>%w[doctor_attention for_agent ready],
    "done" =>           %w[done reclaimed],
    "reclaimed" =>      %w[done reclaimed],
  }

  scope :submitted, -> { where(status: statuses.except("saved", "doctor_attention").values) }

  belongs_to :user
  belongs_to :photo
  has_many :comments, inverse_of: :claim

  has_many :files, through: :claim_files, class_name: "EdtFile", source: :edt_file
  has_many :claim_files

  belongs_to :original, class_name: "Claim"

  def for_json(include_comments)
    response = details.merge({id: id,
                               status: status,
                               photo_id: photo_id,
                               number: number,
                               created_at: created_at,
                               updated_at: updated_at,
                             })
    if include_comments
      response[:comments] = comments.map do |comment|
        {
          body: comment.body,
          user_name: comment.user.try(:name),
          created_at: comment.created_at,
        }
      end
# if we're going to do this, we should use a counter cache.  Some
# doctors have thousands of claims, so we have to watch out for n+1
#    else
#      response[:comments_count] = comments.size
    end
    response
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
    self.status = 'uploaded'
    self
  end

  def process_rmb_record(record)
    details_will_change!
    details['patient_name'] = record["Patient's First Name"].titleize + ' ' + record["Patient's Last Name"].titleize
    details['patient_number'] = record['Registration Number']
    details['patient_sex'] = record["Patient's Sex"].to_i == 1 ? 'M' : 'F'
  end

  def process_item(record)
    details_will_change!
    details['daily_details'] << {
      "code" => record['Service Code'],
      "fee" => record['Fee Submitted'],
      "units" => record['Number of Services'],
      "day" => record['Service Date'].strftime("%Y-%m-%d"),
    }
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
      records = Record.process_batch(to_record)
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

  def submitted_fee
    submitted_details['daily_details'] .reduce(0) do |sum, dets|
      sum += dets['Fee Submitted'] + dets['premiums'].reduce(0) do |sum2, prem|
        sum2 += prem['Fee Submitted']
      end
    end
  end

  def remittance_advice
    files.remittance_advices.order("created_at").last
  end

  def remittance_details
    return nil if remittance_advice.nil?
    remittance_advice.claim_details(self)
  end

  def paid_fee
    return 0 if remittance_details.nil?
    remittance_details['items'].reduce(0) do |sum, dets|
      sum += dets['Amount Paid'] + dets['premiums'].reduce(0) do |sum2, prem|
        sum2 += prem['Amount Paid']
      end
    end
  end

  # daily_details, normalized, and with a better name
  def items
    details['daily_details'].map do |daily|
      code = daily['code'][0..4].upcase
      code[4]='A' if !code[4] || !'ABC'.include?(code[4])
      { code: code,
        day: Date.strptime(daily['day']),
        fee: BigDecimal(daily['fee']) / BigDecimal(100),
        units: daily['units'],
        message: daily['message'],
        premiums: (daily['premiums'] || []).map do |premium|
          code = premium['code'][0..4].upcase
          code[4]='A' if !code[4] || !'ABC'.include?(code[4])
          { code: code,
            fee: BigDecimal(premium['fee']) / BigDecimal(100),
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
