
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

  scope :include_submission_status, -> {joins("LEFT OUTER JOIN claim_files ON claims.id = claim_files.claim_id AND claim_files.edt_file_type = 'Submission'").joins("LEFT OUTER JOIN edt_files ON edt_files.type = 'Submission' AND claim_files.edt_file_id = edt_files.id AND claim_files.claim_id = claims.id").select("edt_files.id as submission_id, edt_files.status as submission_status")}

  scope :include_service_date_sql, -> { select("(SELECT day FROM claim_items WHERE claim_items.claim_id = claims.id ORDER BY created_at ASC LIMIT 1) AS service_date_sql") }

  scope :include_user_name, -> {joins(:user).select("users.name as user_name")}

  belongs_to :user, inverse_of: :claims
  belongs_to :photo, inverse_of: :claim
  has_many :comments, inverse_of: :claim
  has_many :items, inverse_of: :claim
  has_many :rows, through: :items

  has_many :files, through: :claim_files, class_name: "EdtFile", source: :edt_file, inverse_of: :claims
  has_many :claim_files, inverse_of: :claim

  belongs_to :original, class_name: "Claim", inverse_of: :reclamation
  has_one :reclamation, class_name: "Claim", foreign_key: :original_id, inverse_of: :original

  # calculated client side
  attr_accessor :consult_time_type
  attr_reader :consult_premium_visit_count,
              :consult_premium_first_count,
              :consult_premium_travel_count

  validation_scope :warnings do |s|
    s.validates :hospital, :patient_province, :patient_birthday, presence: true
    s.validates :patient_province, inclusion: {in: %w[ON AB BC MB NL NB NT NS PE SK NU YT]}
    s.validates :patient_sex, inclusion: {in: %w[M F]}, if: -> { patient_province != "ON" }
    s.validates :payment_program, inclusion: {in: ['HCP', 'WCB', nil]}, if: -> { patient_province == "ON" }
    s.validates :payment_program, inclusion: {in: ['RMB', 'WCB', nil]}, if: -> { patient_province != "ON" }
    s.validates :patient_name, presence: true, if: -> { patient_province != "ON" }
    s.validates :hospital, format: {with: /\A\d{4}/}
    s.validates :consult_time_in, :consult_time_out, time: true, format: {with: /\A\d{2}:\d{2}\Z/, type: {is_a: String}}, allow_nil: true
    s.validates :items, associated: true
    s.validates :admission_on, :first_seen_on, :last_seen_on, presence: true, if: -> { not simplified? }
    s.validates :most_responsible_physician, :last_seen_discharge, inclusion: {in: [true, false, nil]}, if: -> { not simplified? }
    s.validates :consult_type, inclusion: {in: Claim::CONSULT_TYPES}, if: -> { consult_tab_visible }
    s.validate :validate_patient_number
    s.validate :validate_seen_on, if: -> { not simplified? }
    s.validate :validate_record
  end
  validates_associated :items
  validates :photo_id, uuid: true, allow_nil: true
  validates :user, presence: true
  validates :consult_type, inclusion: {in: Claim::CONSULT_TYPES}, allow_nil: true
  validates :consult_premium_visit, inclusion: {in: Claim::CONSULT_PREMIUM_VISITS}, allow_nil: true
  validates :specialty, inclusion: {in: User::SPECIALTIES}

  # FIXME
  # before_validation do
  #   if details_changed?
  #     self.total_fee = details['daily_details'].reduce(0) do |sum, dets|
  #       sum += (dets['fee'] || 0) + (dets['premiums'] || []).reduce(0) do |sum2, prem|
  #         sum2 += (prem['fee'] || 0)
  #       end
  #     end
  #   end
  # end

  before_validation do
    if number.nil?
      self.number = user.claims.maximum(:number).to_i.succ
    end
  end

  def validate_patient_number
    if patient_province == 'ON' && patient_number
      if !patient_number.match(/\A\d{10}[a-zA-z]{0,2}\Z/)
        warnings.add(:patient_number, "must be 10 digits + 0-2 characters")
        return false
      end
      patient_int = patient_number[0..9].to_i
      checksum=(1..9).inject(0) {|sum, i|
        d = (patient_int%(10**(i+1))) / 10**i
        if i%2==1
          (d >= 5 ? sum + 1 + d*2%10 : sum + d*2)
        else
          sum + d
        end
      }
      warnings.add(:patient_number, "checksum error") if (checksum+patient_int)%10 != 0
    elsif !patient_number
      warnings.add(:patient_number, "required")
    elsif !patient_number.match(/\d{6,12}/)
        warnings.add(:patient_number, "must be a number")
    end
  end

  def validate_seen_on
    if first_seen_on && admission_on && first_seen_on < admission_on
      warnings.add(:first_seen_on, "must be after admission date")
      warnings.add(:admission_on, "must be before first seen date")
    end
    if last_seen_on && first_seen_on && last_seen_on < first_seen_on
      warnings.add(:first_seen_on, "must be before last seen date")
      warnings.add(:last_seen_on, "must be after first seen date")
    end
  end

  def simplified?
    %w[anesthesiologist surgical_assist psychotherapist].include?(specialty)
  end

  def self.in_minutes(s)
    split = s.split(':')
    split[0].to_i * 60 + split[1].to_i
  end

  def consult_time
    return 0 if consult_time_out.nil? || consult_time_in.nil?
    delta = self.class.in_minutes(consult_time_out) - self.class.in_minutes(consult_time_in)
    delta = delta + 24*60 if delta < 0
    delta
  end

  def validate_consult_time
    limit = {
      'comprehensive_er' => 75,
      'comprehensive_non_er' => 75,
      'special_er' => 50,
      'special_no_er' => 50
    }[consult_type]
    if limit && consult_time < limit
      warnings.add(:consult_time_out, "must be at least #{limit} minutes")
    end
  end

  def from_record(record)
    if record['Health Number'] != 0
      self.patient_number = record['Health Number'].to_s+record['Version Code']
      self.patient_birthday = record["Patient's Birthdate"]
      self.patient_province = "ON"
    else
      self.patient_birthday = record["Patient's Birthdate"]
      # the rest will be on the RMB record
    end
    self.hospital = record['Master Number']
    self.payment_program = record['Payment Program']
    self.payee = record['Payee']
    self.referring_physician = record['Referring Health Care Provider Number']
    self.service_location = record['Service Location Indicator']
    self.manual_review_indicator = record['Manual Review Indicator'] == 'Y'
    self.referring_laboratory = record['Referring Laboratory License Number']
    self.admission_on = record["In-Patient Admission Date"].strftime("%Y-%m-%d") if record["In-Patient Admission Date"]
    self.number = record["Accounting Number"].to_i
    self.status = 'file_created'
    self
  end

  def process_rmb_record(record)
    self.patient_name = record["Patient's First Name"].titleize + ' ' + record["Patient's Last Name"].titleize
    self.patient_number = record['Registration Number']
    self.patient_sex = record["Patient's Sex"].to_i == 1 ? 'M' : 'F'
    self.patient_province = record["Province Code"]
  end

  def process_item(record)
    item = items.create("day" => record['Service Date'].strftime("%Y-%m-%d"))
    item.rows.create("code" => record['Service Code'],
                     "fee" => record['Fee Submitted'],
                     "units" => record['Number of Services'])
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
    (items.first && items.first.day) || first_seen_on
  end

  # we get information like total fee from the batch files rather than
  # calculating it because these calculations can change over time
  # so make sure a claim is never changed after it is submitted.   If
  # you need to change a claim, clone it first
  def submitted_details
    return @submitted_details if @submitted_details

    @submitted_details = { 'items' => [] }
    if submission
      records = submission.claim_records(self)
    else
      return { 'items' => [] }
    end

    records.each do |record|
      if record.kind_of?(ClaimHeaderRecord) || record.kind_of?(ClaimHeaderRMBRecord)
        @submitted_details.merge!(record.fields)
      elsif record.kind_of?(ItemRecord)
        found = false
        items.each_with_index do |item, i|
          if item.day == record['Service Date']
            item.rows.each_with_index do |row, j|
              if row.code_normalized == record['Service Code']
                @submitted_details['items'].push(record.fields.merge(item_id: item.id, row_id: row.id))
                found = true
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
    items.each do |item|
      new_item = item.dup
      claim.items << new_item
      item.rows.each do |row|
        new_row = row.dup
        new_row.paid = 0
        new_row.message = nil
        new_item.rows << new_row
      end
    end
    claim.save!
    claim
  end

  def names
    return [] unless patient_name
    if patient_name.match(/,/)
      patient_name.split(',', 2).map(&:strip).reverse
    else
      patient_name.split(' ', 2).map(&:strip)
    end
  end

  def to_header_record
    province = (patient_province || 'ON').upcase

    r = ClaimHeaderRecord.new

    referring_provider = referring_physician
    unless referring_provider.blank?
      referring_provider = referring_provider.to_s.split(' ')[0]
      if referring_provider !='0' && (referring_provider.length < 5 || referring_provider.length > 6)
        r.errors << [:referring_physician, 'invalid']
      end
    end

    pp = payment_program == 'WCB' ? 'WCB' : (province == 'ON' ? 'HCP' : 'RMB')

    if (pp != 'RMB')
      r.insert('Health Number', :patient_number, patient_number[0..9])
      r.insert('Version Code', :patient_number, patient_number[10..11].try(:upcase))
    end
    r.insert("Patient's Birthdate", :patient_birthday, patient_birthday)
    r.insert('Accounting Number', :number, number)
    r.insert('Payment Program', :payment_program, pp)
    r.insert('Payee', :payee, payee || 'P')
    r.insert('Referring Health Care Provider Number', :referring_physician, referring_provider) unless referring_provider.blank?
    r.insert('Master Number', :hospital, (hospital || '').split(' ')[0])
    r.insert('In-Patient Admission Date', :admission_on, admission_on) if admission_on
    r.insert('Referring Laboratory License Number', :referring_laboratory, referring_laboratory) if referring_laboratory
    r.insert('Manual Review Indicator', :manual_review_indicator, manual_review_indicator ? 'Y' : '')
    r.insert('Service Location Indicator', :service_location, service_location) if service_location
    r
  end

  def to_rmb_record
    r=ClaimHeaderRMBRecord.new
    r.insert("Registration Number", :patient_number, patient_number)
    province = (patient_province || 'ON').upcase
    if names.length < 2
      r.errors << [:patient_name, 'must contain first and last name']
    else
      r.insert("Patient's First Name", :patient_name, names[0])
      r.insert("Patient's Last Name", :patient_name, names[1])
    end
    r.insert("Patient's Sex", :patient_sex, patient_sex == 'F' ? 2 : 1)
    r.insert("Province Code",:patient_province, (patient_province || 'ON').upcase)
    r
  end

  def validate_record
    to_header_record.errors.each do |attr, err|
      warnings.add(attr, err.to_s) unless warnings.include?(attr)
    end
    to_rmb_record.errors.each do |attr, err|
      warnings.add(attr, err.to_s) unless warnings.include?(attr)
    end
  end

  def any_warnings?
    has_warnings? || items.map(&:any_warnings?).any?
  end

  def total_fee
    rows.sum(:fee)
  end

  def consult_setup_visible
    ['family_medicine', 'internal_medicine', 'cardiology'].include? specialty
  end

  def consult_tab_visible
    consult_setup_visible && first_seen_consult
  end

  def consult_premium_visit_count
    if @consult_time_type && user
      @consult_premium_visit_count ||= user.claims.where("first_seen_on = ? and consult_premium_visit = ?", first_seen_on, consult_time_type).count
    else
      nil
    end
  end

  def consult_premium_first_count
    if @consult_time_type && user
      @consult_premium_first_count ||= user.claims.where("first_seen_on = ? and consult_premium_first = true and consult_premium_visit = ?", first_seen_on, consult_time_type).count
    else
      nil
    end
  end

  def consult_premium_travel_count
    if @consult_time_type && user
      @consult_premium_travel_count ||= user.claims.where("first_seen_on = ? and consult_premium_travel = true and consult_premium_visit = ?", first_seen_on, consult_time_type).count
    else
      nil
    end
  end

  def as_json(options = nil)
    attributes.tap do |response|
      response[:items] = items.map(&:as_json)

      valid?
      response[:errors] = errors.as_json
      has_warnings?
      response[:warnings] = warnings.as_json

      interactor = GenerateSubmission.new
      begin
        interactor.generate_claim(self)
        interactor.errors[number].each do |err|
          response[:warnings][err.first] ||= [err.second.to_s]
        end
        response[:submission] = interactor.contents
      rescue StandardError => e
        response[:warnings][:submission] = [e.to_s]
      end

      response[:photo] = {
        small_url: photo.try(:file).try(:small).try(:url),
        url: photo.try(:file).try(:url)
      }

      response[:reclamation_id] = reclamation.id if status=="reclaimed" && reclamation
      response[:comments] = comments.map(&:as_json)
      response[:num_comments] = comments.size

      response[:files] = files.reduce({}) do |hash, file|
        hash.merge(file.filename => Rails.application.routes.url_helpers.admin_edt_file_path(file))
      end

      %I[service_date consult_setup_visible consult_tab_visible consult_premium_visit_count consult_premium_first_count consult_premium_travel_count].each do |param|
        response[param] = send(param)
      end

      response.delete(:details)
      response.delete('details')

      response.delete('status')
      response[:status] = status
    end
  end
end
