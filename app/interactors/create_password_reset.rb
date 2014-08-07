class CreatePasswordReset
  include ActiveModel::Model

  attr_accessor :email, :token
  attr_reader :user

  validates :email, presence: true, email: true
  validate :email_existence

  def perform
    @user = User.find_by(email: email.to_s.downcase)
    return if invalid?
    generate_token
    UserMailer.password_reset(user, token).deliver
    true
  end

  private

  def generate_token
    @token = Base64.urlsafe_encode64(message_verifier.generate([Time.now.to_i, @user.password_digest]))
  end

  def message_verifier
    Rails.application.message_verifier("password reset")
  end

  def email_existence
    errors.add :email, :invalid if @user.blank? or @user.password_digest.blank?
  end
end
