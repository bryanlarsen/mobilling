class V3::CreateSession
  include ActiveModel::Model

  attr_accessor :email, :password
  attr_reader :user, :token

  validates :email, :password, presence: true
  validate :authenticity

  def perform
    @user = User.find_by(email: email.to_s.downcase)
    return false if invalid?
    @token = SecureRandom.hex(32)
    @user.update!(authentication_token: token, token_at: DateTime.now)
  end

  private

  def authenticity
    errors.add :password, :invalid unless user.present? and user.authenticate(password)
  end
end
