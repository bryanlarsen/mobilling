class CreatePassword
  include ActiveModel::Model

  EXPIRATION_TIME = 1.day

  attr_reader :created_at, :password_digest
  attr_accessor :token

  validates :token, presence: true
  validate :token_verification, :token_expiration, :user_existence, if: :token?

  def perform
    return if invalid?
    user.update!(password: SecureRandom.hex(12))
    UserMailer.new_password(user).deliver_now
    true
  end

  def token?
    token.present?
  end

  def expired?
    Time.now.to_i > created_at.to_i + EXPIRATION_TIME
  end

  def user
    return if password_digest.blank?
    @user ||= User.find_by(password_digest: password_digest)
  end

  def created_at
    message.first
  end

  def password_digest
    message.second
  end

  private

  def message_verifier
    Rails.application.message_verifier("password reset salt")
  end

  def message
    message_verifier.verify(Base64.urlsafe_decode64(token.to_s))
  rescue ActiveSupport::MessageVerifier::InvalidSignature, ArgumentError
    []
  end

  def token_verification
    errors.add :token, :invalid if message.blank?
  end

  def token_expiration
    errors.add :token, :invalid if expired?
  end

  def user_existence
    errors.add :token, :invalid if user.blank?
  end
end
