class UpdateClaim
  include ActiveModel::Model

  attr_accessor :user, :id, :patient_name, :hospital
  attr_reader :claim

  validates :id, uuid: true
  validates :user, presence: true

  def perform
    return false if invalid?
    @claim = user.claims.find_or_initialize_by(id: id)
    @claim.update!(details: @claim.details.merge(details))
  end

  private

  def details
    {
      "patient_name" => patient_name,
      "hospital" => hospital
    }
  end
end
