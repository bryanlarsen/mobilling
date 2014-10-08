class Admin::UpdateClaim
  include ActiveModel::Model

  attr_accessor :status, :patient_name, :comment

  attr_reader :claim, :admin_user

  validates :status, inclusion: {in: Claim.statuses.keys}

  def initialize(claim, admin_user, attributes = nil)
    @claim = claim
    @admin_user = admin_user
    self.status = @claim.status
    self.patient_name = @claim.details["patient_name"]
    super(attributes)
  end

  def perform
    return false if invalid?
    status_was = @claim.status
    @claim.update!(claim_attributes)
    @claim.comments.create!(user: admin_user, body: comment) if comment.present?
    if status_was != "rejected_doctor_attention" and status == "rejected_doctor_attention"
      UserMailer.claim_rejected(claim.user, claim).deliver_now
    end
    true
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
