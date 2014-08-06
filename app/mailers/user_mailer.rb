class UserMailer < ActionMailer::Base
  default from: "info@mo-billing.ca"

  def claim_rejected(user, claim)
    @user = user
    @claim = claim
    mail(to: @user.email, subject: "Claim Rejected")
  end
end
