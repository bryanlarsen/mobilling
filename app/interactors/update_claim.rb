class UpdateClaim
  include ActiveModel::Model

  attr_accessor :user, :status, :photo_id, :patient_name, :hospital,
                :referring_physician, :most_responsible_physician,
                :admission_on, :first_seen_on, :first_seen_consult,
                :last_seen_on, :last_seen_discharge, :icu_transfer,
                :consult_type, :consult_time_in, :consult_time_out,
                :consult_premium_first, :consult_premium_visit,
                :consult_premium_travel, :comment

  attr_writer :daily_details, :diagnoses
  attr_reader :claim

  validates :photo_id, uuid: true, allow_nil: true
  validates :status, inclusion: {in: %w[saved unprocessed rejected_doctor_attention rejected_admin_attention]}
  validates :user, presence: true
  validates :patient_name, :hospital, :referring_physician, type: {is_a: String}, allow_nil: true
  validates :most_responsible_physician, :first_seen_consult, :last_seen_discharge, :icu_transfer, :consult_premium_travel, :consult_premium_first, inclusion: {in: [false, true]}, allow_nil: true
  validates :first_seen_on, :last_seen_on, :admission_on, date: true, format: {with: /\A\d{4}-\d{2}-\d{2}\Z/}, type: {is_a: String}, allow_nil: true
  validates :consult_type, inclusion: {in: Claim::CONSULT_TYPES}, allow_nil: true
  validates :consult_premium_visit, inclusion: {in: Claim::CONSULT_PREMIUM_VISITS}, allow_nil: true
  validates :consult_time_in, :consult_time_out, time: true, format: {with: /\A\d{2}:\d{2}\Z/, type: {is_a: String}}, allow_nil: true
  validates :photo_id, :patient_name, :hospital, :diagnoses, :admission_on, :first_seen_on, :last_seen_on, presence: true, if: :submitted?
  validates :most_responsible_physician, :last_seen_discharge, inclusion: {in: [true, false]}, if: :submitted?
  validates :daily_details, :diagnoses, associated: true
  validates :daily_details, length: {minimum: 1}, if: :submitted?

  def initialize(claim, attributes = nil)
    @claim = claim
    super(attributes)
  end

  def perform
    return false if invalid?
    @claim.update!(claim_attributes)
    @claim.comments.create!(user: user, body: comment) if comment.present?
    true
  end

  def submitted?
    status == "unprocessed"
  end

  def daily_details
    return @daily_details unless @daily_details.is_a?(Array)
    @daily_details.map { |daily_detail| DailyDetailForm.new(daily_detail).tap { |detail| detail.interactor = self } }
  end

  def diagnoses
    return @diagnoses unless @diagnoses.is_a?(Array)
    @diagnoses.map { |diagnosis| DiagnosisForm.new(diagnosis).tap { |result| result.interactor = self } }
  end

  private

  def claim_attributes
    {
      photo_id: photo_id,
      status: status,
      details: claim_attributes_details
    }
  end

  def claim_attributes_details
    {
      "specialty"                  => claim.details["specialty"],
      "patient_name"               => patient_name,
      "hospital"                   => hospital,
      "referring_physician"        => referring_physician,
      "diagnoses"                  => (diagnoses || []).map(&:as_json),
      "most_responsible_physician" => most_responsible_physician,
      "admission_on"               => admission_on,
      "first_seen_on"              => first_seen_on,
      "first_seen_consult"         => first_seen_consult,
      "last_seen_on"               => last_seen_on,
      "last_seen_discharge"        => last_seen_discharge,
      "icu_transfer"               => icu_transfer,
      "consult_type"               => consult_type,
      "consult_time_in"            => consult_time_in,
      "consult_time_out"           => consult_time_out,
      "consult_premium_visit"      => consult_premium_visit,
      "consult_premium_first"      => consult_premium_first,
      "consult_premium_travel"     => consult_premium_travel,
      "daily_details"              => (daily_details || []).map(&:as_json).sort_by { |daily_detail| daily_detail["day"] }
    }
  end
end
