class UpdateClaim
  include ActiveModel::Model

  attr_accessor :user, :id, :photo_id, :patient_name, :hospital,
                :referring_physician, :diagnosis,
                :most_responsible_physician, :admission_on,
                :first_seen_on, :first_seen_consult, :last_seen_on,
                :last_seen_discharge, :icu_transfer, :consult_type,
                :consult_time_in, :consult_time_out,
                :consult_premium_visit, :consult_premium_travel,
                :details

  attr_reader :claim

  validates :id, uuid: true
  validates :photo_id, uuid: true, allow_nil: true
  validates :user, presence: true
  validates :patient_name, :hospital, :referring_physician, :diagnosis, type: {is_a: String}, allow_nil: true
  validates :most_responsible_physician, :first_seen_consult, :last_seen_discharge, :icu_transfer, :consult_premium_travel, inclusion: {in: [false, true]}, allow_nil: true
  validates :first_seen_on, :last_seen_on, :admission_on, date: true, format: {with: /\A\d{4}-\d{2}-\d{2}\Z/}, type: {is_a: String}, allow_nil: true
  validates :consult_type, inclusion: {in: %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er]}, allow_nil: true
  validates :consult_premium_visit, inclusion: {in: %w[office_hours day evening night holiday]}, allow_nil: true
  validates :consult_time_in, :consult_time_out, time: true, format: {with: /\A\d{2}:\d{2}\Z/, type: {is_a: String}}, allow_nil: true

  def perform
    return false if invalid?
    @claim = user.claims.find_or_initialize_by(id: id)
    @claim.update!(photo_id: photo_id, details: claim_details)
  end

  private

  def claim_details
    {
      "patient_name"               => patient_name,
      "hospital"                   => hospital,
      "referring_physician"        => referring_physician,
      "diagnosis"                  => diagnosis,
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
      "consult_premium_travel"     => consult_premium_travel,
      "details"                    => details
    }
  end
end
