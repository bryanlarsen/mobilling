class UpdateClaim
  include ActiveModel::Model

  attr_accessor :user, :id, :photo_id, :patient_name, :hospital,
                :referring_physician, :diagnosis,
                :most_responsible_physician, :admission_on,
                :first_seen_on, :first_seen_consult, :last_seen_on,
                :last_seen_discharge, :icu_transfer, :consult_type,
                :consult_time_in, :consult_time_out,
                :consult_premium_visit, :consult_premium_travel

  attr_reader :claim

  validates :id, uuid: true
  validates :user, presence: true

  def perform
    return false if invalid?
    @claim = user.claims.find_or_initialize_by(id: id)
    @claim.update!(photo_id: photo_id, details: details)
  end

  private

  def details
    {
      "patient_name" => patient_name,
      "hospital" => hospital,
      "referring_physician" => referring_physician,
      "diagnosis" => diagnosis,
      "most_responsible_physician" => most_responsible_physician,
      "admission_on" => admission_on,
      "first_seen_on" => first_seen_on,
      "first_seen_consult" => first_seen_consult,
      "last_seen_on" => last_seen_on,
      "last_seen_discharge" => last_seen_discharge,
      "icu_transfer" => icu_transfer,
      "consult_type" => consult_type,
      "consult_time_in" => consult_time_in,
      "consult_time_out" => consult_time_out,
      "consult_premium_visit" => consult_premium_visit,
      "consult_premium_travel" => consult_premium_travel
    }
  end
end
