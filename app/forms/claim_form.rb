class ClaimForm
  include ActiveModel::Model
  include Virtus.model
  include ValidationScopes

  def self.model_params
    return [
            [:photo_id, String],
            [:status, String],
            [:user_id, String]
           ]
  end

  def self.details_params
    return [
            [:specialty, String],
            [:patient_name, String],
            [:hospital, String],
            [:referring_physician, String],
            [:most_responsible_physician, :bool],
            [:admission_on, String],
            [:first_seen_on, String],
            [:first_seen_consult, :bool],
            [:last_seen_on, String],
            [:last_seen_discharge, :bool],
            [:icu_transfer, :bool],
            [:consult_type, String],
            [:consult_time_in, String],
            [:consult_time_out, String],
            [:consult_premium_visit, String],
            [:consult_premium_first, :bool],
            [:consult_premium_travel, :bool],
            [:patient_number, String],
            [:patient_province, String],
            [:patient_birthday, String],
            [:patient_sex, String],
            [:referring_laboratory, String],
            [:payment_program, String],
            [:payee, String],
            [:manual_review_indicator, :bool],
            [:service_location, String],
            [:last_code_generation, String],
           ]
  end

  def self.helper_params
    return [
            [:comment, String],           # new comment
            [:num_comments, Integer],     # number of comments when editing started
            [:consult_time_type, String], # if set, can return premium counts
           ]
  end

  def self.scalar_params
    return model_params + details_params + helper_params
  end

  def self.array_params
    return [
            [:diagnoses, Array, [[:name, String]]],
            [:daily_details, Array, DailyDetailForm.all_params],
           ]
  end

  def self.all_params
    return scalar_params + array_params
  end

  def self.param_names(list)
    return list.map do |name, type, array|
      if type == Array
        { name => param_names(array) }
      else
        name
      end
    end
  end

  def self.all_param_names
    param_names(all_params)
  end

  all_params.each do |name, type|
    if type == :bool
      attribute name, Axiom::Types::Boolean
    else
      attribute name, type
    end
  end
  attribute :user, User

#  attr_accessor *(scalar_params.map &:first)

#  attr_accessor :user, :photo_id
#  attr_writer :daily_details, :diagnoses

  attr_reader :claim

  validates :photo_id, uuid: true, allow_nil: true
  validates :status, inclusion: {in: Claim.statuses.keys}
  validates :user, presence: true

  validates :consult_type, inclusion: {in: Claim::CONSULT_TYPES}, allow_nil: true
  validates :consult_premium_visit, inclusion: {in: Claim::CONSULT_PREMIUM_VISITS}, allow_nil: true
  validates :specialty, inclusion: {in: User::SPECIALTIES}
  validates :daily_details, associated: true

  validation_scope :warnings do |s|
    s.validates :hospital, :patient_number, :patient_province, :patient_birthday, presence: true
    s.validates :patient_province, inclusion: {in: %w[ON AB BC MB NL NB NT NS PE SK NU YT]}
    s.validates :patient_sex, inclusion: {in: %w[M F]}, if: -> { patient_province != "ON" }
    s.validates :patient_name, presence: true, if: -> { patient_province != "ON" }
    s.validates :hospital, format: {with: /\A\d{4}/}
    s.validates :first_seen_on, :last_seen_on, :admission_on, :patient_birthday, date: true, format: {with: /\A\d{4}-\d{2}-\d{2}\Z/}, allow_nil: true
    s.validates :consult_time_in, :consult_time_out, time: true, format: {with: /\A\d{2}:\d{2}\Z/, type: {is_a: String}}, allow_nil: true
    s.validates :admission_on, :first_seen_on, :last_seen_on, presence: true, if: -> { not simplified? }
    s.validates :most_responsible_physician, :last_seen_discharge, inclusion: {in: [true, false, nil]}, if: -> { not simplified? }
    s.validates :daily_details, length: {minimum: 1}, associated: true
    s.validate :validate_patient_number
    s.validate :validate_seen_on, if: -> { not simplified? }
    s.validate :validate_consult_time, if: -> { not simplified? }   #FIXME
    #s.validate :validate_premium_visit, if: -> { not simplified? }   #FIXME
  end

  def submitted?
    # FIXME: used for validations, is wrong
    status != "saved"
  end

  def simplified?
    %w[anesthesiologist surgical_assist psychotherapist].include?(specialty)
  end

  def daily_details
    return @daily_details unless @daily_details.is_a?(Array)
    @daily_details.map { |daily_detail| DailyDetailForm.new(daily_detail) }
  end

  def diagnoses
    return @diagnoses unless @diagnoses.is_a?(Array)
    @diagnoses.map { |diagnosis| DiagnosisForm.new(diagnosis) }
  end

  def initialize(claim, attributes = nil)
    if !claim.is_a?(Claim)
      super(claim)
      self.num_comments = (claim['num_comments'] || '0').to_i
    else
      @claim = claim
      attrs = claim.details.except("diagnosis")
      attrs['status'] = claim.status   # can't use claim.attributes.slice because status is an enum
      attrs['user'] = claim.user
      attrs['photo_id'] = claim.photo_id
      attrs['user_id'] = claim.user_id
      attrs['num_comments'] = claim.comments.size
      attrs.merge!(attributes) if attributes
      super(attrs)
    end
  end

  def perform
    return false if invalid?
    unless @claim
      @claim = user.claims.build
      @claim.number = user.claims.maximum(:number).to_i.succ
    end
    @claim.update!(claim_attributes)
    if comment.present?
      if num_comments < @claim.comments.size
        cmt = @claim.comments.last
        cmt.body = comment
        cmt.save!
      else
        @claim.comments.create!(user: user, body: comment)
      end
    end
    true
  end

  def service_date
    @claim.service_date if @claim
  end

  def consult_setup_visible
    ['family_medicine', 'internal_medicine', 'cardiology'].include? specialty
  end

  def consult_tab_visible
    consult_setup_visible && first_seen_consult
  end

  def claim_attributes
    {
      photo_id: photo_id,
      status: status,
      user_id: user_id,
      details: claim_attribute_details
    }
  end

  def claim_attribute_details
    {}.tap do |dets|
      self.class.details_params.each do |param, klass|
        dets[param.to_s] = self.send(param)
      end
      dets["diagnoses"] = (diagnoses || []).map(&:as_json)
      dets["daily_details"] = (daily_details || []).map(&:as_json)
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

  def validate_consult_time
    # FIXME
  end

  def consult_premium_visit_count
    if consult_time_type && user
      @consult_premium_visit_count ||= user.claims.where("details ->> 'first_seen_on' = ? and details ->> 'consult_premium_visit' = ?", first_seen_on, consult_time_type).count
    else
      nil
    end
  end

  def consult_premium_first_count
    if consult_time_type && user
      @consult_premium_first_count ||= user.claims.where("details ->> 'first_seen_on' = ? and details ->> 'consult_premium_first' = 'true' and details ->> 'consult_premium_visit' = ?", first_seen_on, consult_time_type).count
    else
      nil
    end
  end

  def consult_premium_travel_count
    if consult_time_type && user
      @consult_premium_travel_count ||= user.claims.where("details ->> 'first_seen_on' = ? and details ->> 'consult_premium_travel' = 'true' and details ->> 'consult_premium_visit' = ?", first_seen_on, consult_time_type).count
    else
      nil
    end
  end

  def as_json(options = nil)
    attributes.except(:user)
      .merge(@claim ? {
               id: @claim.id,
               status: @claim.status,
               number: @claim.number,
               created_at: @claim.created_at,
               updated_at: @claim.updated_at
             } : {}).tap do |response|
      if options && options[:include_warnings]
        valid?
        response['errors'] = errors.as_json
        has_warnings?
        response['warnings'] = warnings.as_json
        @claim.valid? if @claim

        daily_details.each.with_index do |item, i|
          item.all_warnings.as_json.each do |key, w|
            response['warnings']["daily_details.#{i}.#{key}"] = w
          end
          item.all_errors.as_json.each do |key, w|
            response['errors']["daily_details.#{i}.#{key}"] = w
          end
        end
      end
      if options && options[:include_submission] && @claim
        interactor = GenerateSubmission.new
        begin
          interactor.generate_claim(@claim)
          interactor.errors[@claim.number].each do |err|
            response['warnings'][err.first] = (response['warnings'][err.first] || []) + [err.second.to_s]
          end
          response['submission'] = interactor.contents
        rescue StandardError => e
          puts e
          puts e.backtrace
        end
      end
      if options && options[:include_photo] && @claim
        response[:photo] = {
          small_url: @claim.photo.try(:file).try(:small).try(:url),
          url: @claim.photo.try(:file).try(:url)
        }
      end
      if options && options[:include_comments] && @claim
        response[:original_id] = @claim.original_id if @claim.original_id
        response[:reclamation_id] = @claim.reclamation.id if @claim.status=="reclaimed" && @claim.reclamation
        response[:comments] = @claim.comments.map do |comment|
          {
            body: comment.body,
            user_name: comment.user.try(:name),
            created_at: comment.created_at,
          }
        end
        response[:num_comments] = @claim.comments.size
      end
      if options && options[:include_total] && @claim
        response[:submitted_fee] = @claim.submitted_fee
        response[:paid_fee] = @claim.paid_fee
        response[:total_fee] = @claim.total_fee
      end
      if options && options[:include_files] && @claim && @claim.files.size > 0
        response[:files] = @claim.files.reduce({}) do |hash, file|
          hash.merge(file.filename => Rails.application.routes.url_helpers.admin_edt_file_path(file))
        end
      end
      if options && options[:include_consult_counts]
        %I[service_date consult_setup_visible consult_tab_visible consult_premium_visit_count consult_premium_first_count consult_premium_travel_count].each do |param|
          response[param] = send(param)
        end
      end
    end
  end
end
