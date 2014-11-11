class CreateUser
  include ActiveModel::Model

  attr_accessor :email, :password, :name, :agent_id, :provider_number, :group_number, :office_code, :specialty_code

  attr_reader :user, :specialties

  validates :email, presence: true, email: true
  validates :agent_id, presence: true
  validates :password, presence: true
  validates :name, presence: true
  validates :specialties, presence: true
  validates :provider_number, numericality: {only_integer: true}, allow_blank: true
  validates :group_number, length: {maximum: 4, minimum: 4}, allow_blank: true
  validates :office_code, length: {maximum: 1}, allow_blank: true
  validates :specialty_code, numericality: {only_integer: true}, allow_blank: true
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
      authentication_token: SecureRandom.hex(32),
      provider_number: provider_number,
      group_number: group_number,
      office_code: office_code,
      specialty_code: specialty_code,
    }
  end

  def email_existence
    errors.add :email, :taken if User.where(email: email.to_s.downcase).exists?
  end
end
