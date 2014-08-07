class UserMailer < ActionMailer::Base
  default from: "info@mo-billing.ca"

  def password_reset(user, token)
    @user = user
    @token = token
    mail(to: @user.email, subject: "Password Reset")
  end

  def claim_rejected(user, claim)
    @user = user
    @claim = claim
    mail(to: @user.email, subject: "Claim Rejected")
  end
end
