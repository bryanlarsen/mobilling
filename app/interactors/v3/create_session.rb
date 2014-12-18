class V3::CreateSession
  include ActiveModel::Model

  attr_accessor :email, :password
  attr_reader :user

  validates :email, :password, presence: true
  validate :authenticity

  def perform
    @user = User.find_by(email: email.to_s.downcase)
    valid?
  end

  private

  def authenticity
    errors.add :password, :invalid unless user.present? and user.authenticate(password)
  end
end
