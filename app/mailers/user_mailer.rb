class UserMailer < ActionMailer::Base
  default from: "info@billohip.ca"

  def password_reset(user, token)
    @user = user
    @token = token
    mail(to: @user.email, subject: "Password Reset")
  end

  def new_password(user)
    @user = user
    mail(to: @user.email, subject: "New Password")
  end

  def claim_rejected(user, claim)
    @user = user
    @claim = claim
    mail(to: @user.email, subject: "Claim Rejected")
  end
end
