class Admin::CreateSession
  include ActiveModel::Model

  attr_accessor :email, :password
  attr_reader :admin_user

  validates :email, :password, presence: true
  validate :authenticity

  def perform
    @admin_user = Admin::User.find_by(email: email.to_s.downcase)
    valid?
  end

  private

  def authenticity
    errors.add :password, :invalid unless admin_user.present? and admin_user.authenticate(password)
  end
end
