class CreatePassword
  include ActiveModel::Model

  EXPIRATION_TIME = 1.day

  attr_reader :created_at, :user_id
  attr_accessor :token

  validates :token, presence: true
  validate :token_verification, :token_expiration, :user_existence, :user_updated, if: :token?

  def perform
    return if invalid?
    user.update_attribute('password', SecureRandom.hex(12))
    if user.save(validation: false)
      begin
        UserMailer.new_password(user).deliver_now
        true
      rescue StandardError => e
        Rails.logger.warn e
        false
      end
    else
      Rails.logger.warn "user save failed"
      Rails.logger.warn user.errors.to_yaml
      false
    end
  end

  def token?
    token.present?
  end

  def expired?
    Time.now.to_i > created_at.to_i + EXPIRATION_TIME
  end

  def user
    return if user_id.blank?
    @user ||= User.find_by(id: user_id)
  end

  def created_at
    message.first
  end

  def user_id
    message.second
  end

  def updated_at
    message.last
  end

  private

  def message
    CreatePasswordReset.message_verifier.verify(Base64.urlsafe_decode64(token.to_s))
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

  def user_updated
    errors.add :token, :invalid if !user || user.updated_at != updated_at
  end
end
