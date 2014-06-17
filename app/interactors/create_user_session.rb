class CreateUserSession
  include ActiveModel::Model

  attr_accessor :email, :password, :user

  validates :email, :password, presence: true
  validate :authenticate

  def perform
    @user = User.find_by(email: email)
    if valid?
      @user.update!(authentication_token: SecureRandom.hex(32))
    else
      false
    end
  end

  private

  def authenticate
    errors.add :password, :invalid unless user.present? and user.authenticate(password)
  end
end
