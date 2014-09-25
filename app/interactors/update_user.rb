class UpdateUser
  include ActiveModel::Model

  attr_accessor :email, :name, :agent_id, :password, :pin, :provider_number, :group_number, :office_code, :specialty_code
  attr_reader :user, :specialties

  validates :email, presence: true, email: true
  validates :agent_id, presence: true
  validates :name, presence: true
  validates :specialties, presence: true
  validates :pin, format: {with: /\A\d{4}?\Z/}
  validates :provider_number, numericality: {only_integer: true}, allow_blank: true
  validates :group_number, length: {maximum: 4, minimum: 4}, allow_blank: true
  validates :office_code, length: {maximum: 1}, allow_blank: true
  validates :specialty_code, numericality: {only_integer: true}, allow_blank: true
  validate :existence

  def initialize(user, attributes = nil)
    @user            = user
    self.name        = @user.name
    self.email       = @user.email
    self.agent_id    = @user.agent_id
    self.pin         = @user.pin
    self.specialties = @user.specialties
    self.group_number= @user.group_number
    self.office_code = @user.office_code
    self.specialty_code = @user.specialty_code
    self.provider_number  = @user.provider_number
    super(attributes)
  end

  def perform
    return if invalid?
    @user.update!(user_attributes)
  end

  def specialties=(specialties)
    @specialties = Array(specialties).select { |specialty| User::SPECIALTIES.include?(specialty) }
  end

  def persisted?
    true
  end

  private

  def user_attributes
    {
      name: name,
      email: email.to_s.downcase,
      password: password.to_s,
      agent_id: agent_id,
      specialties: specialties,
      pin: pin,
      provider_number: provider_number,
      group_number: group_number,
      office_code: office_code,
      specialty_code: specialty_code,
    }
  end

  def existence
    errors.add :email, :taken if User.where.not(id: user.id).where(email: email.to_s.downcase).exists?
  end
end
