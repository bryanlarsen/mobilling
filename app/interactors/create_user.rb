class CreateUser
  include ActiveModel::Model

  attr_accessor :email, :password, :name, :agent_id
  attr_reader :user, :specialties

  validates :email, presence: true, email: true
  validates :agent_id, presence: true
  validates :password, presence: true
  validates :name, presence: true
  validates :specialties, presence: true
  validate :email_existence

  def initialize(attributes = nil)
    @user = User.new
    super(attributes)
  end

  def perform
    return false if invalid?
    @user.update!(user_attributes)
  end

  def specialties=(specialties)
    @specialties = Array(specialties).select { |specialty| User::SPECIALTIES.include?(specialty) }
  end

  private

  def user_attributes
    {
      name: name,
      email: email.to_s.downcase,
      password: password,
      agent_id: agent_id,
      specialties: specialties,
      authentication_token: SecureRandom.hex(32)
    }
  end

  def email_existence
    errors.add :email, :taken if User.where(email: email.to_s.downcase).exists?
  end
end
