class UpdateUser
  include ActiveModel::Model

  attr_accessor :email, :name, :agent_id, :password, :pin
  attr_reader :user, :specialties

  validates :email, presence: true, email: true
  validates :agent_id, presence: true
  validates :name, presence: true
  validates :specialties, presence: true
  validates :pin, format: {with: /\A\d{4}?\Z/}
  validate :existence

  def initialize(user, attributes = nil)
    @user            = user
    self.name        = @user.name
    self.email       = @user.email
    self.agent_id    = @user.agent_id
    self.pin         = @user.pin
    self.specialties = @user.specialties
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
      pin: pin
    }
  end

  def existence
    errors.add :email, :taken if User.where.not(id: user.id).where(email: email.to_s.downcase).exists?
  end
end
