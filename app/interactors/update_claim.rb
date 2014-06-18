class UpdateClaim
  include ActiveModel::Model

  attr_accessor :user, :id, :patient_name, :hospital, :referring_physician, :diagnosis, :admission_on, :first_seen_on, :last_seen_on
  attr_reader :claim

  validates :id, uuid: true
  validates :user, presence: true

  def perform
    return false if invalid?
    @claim = user.claims.find_or_initialize_by(id: id)
    @claim.update!(details: details)
  end

  private

  def details
    {
      "patient_name" => patient_name,
      "hospital" => hospital,
      "referring_physician" => referring_physician,
      "diagnosis" => diagnosis,
      "admission_on" => admission_on,
      "first_seen_on" => first_seen_on,
      "last_seen_on" => last_seen_on
    }
  end
end
