class Admin::UpdateClaim
  include ActiveModel::Model

  attr_accessor :status, :patient_name

  attr_reader :claim

  validates :status, inclusion: {in: Claim.statuses.keys}

  def initialize(claim, attributes = nil)
    @claim = claim
    self.status = @claim.status
    self.patient_name = @claim.details["patient_name"]
    super(attributes)
  end

  def perform
    return false if invalid?
    @claim.update!(claim_attributes)
  end

  def persisted?
    true
  end

  private

  def claim_attributes
    {
      status: status,
      details: claim_attributes_details
    }
  end

  def claim_attributes_details
    {
      "patient_name" => patient_name
    }.reverse_merge(@claim.details)
  end
end
