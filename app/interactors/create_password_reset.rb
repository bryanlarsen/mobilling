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
    UserMailer.password_reset(user, token).deliver_now
    true
  end

  private

  def message_verifier
    Rails.application.message_verifier((ENV["SECRET_KEY_BASE"] || 'dev') + ":password reset salt")
  end

  def generate_token
    message = [Time.now.to_i, @user.id]
    @token = Base64.urlsafe_encode64(message_verifier.generate(message))
  end

  def email_existence
    errors.add :email, :invalid if @user.blank?
  end
end
