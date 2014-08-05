class Admin::UpdateAdminUser
  include ActiveModel::Model

  attr_accessor :email, :password, :name, :role
  attr_reader :admin_user

  validates :name, presence: true
  validates :email, presence: true, email: true
  validates :password, confirmation: true
  validates :role, presence: true
  validate :existence

  def initialize(admin_user, attributes = nil)
    @admin_user = admin_user
    self.email = @admin_user.email
    self.name = @admin_user.name
    self.role = @admin_user.role
    super(attributes)
  end

  def perform
    if valid?
      @admin_user.update!(admin_user_attributes)
    else
      false
    end
  end

  def persisted?
    true
  end

  private

  def admin_user_attributes
    {
      name: name,
      email: email,
      password: password,
      role: role
    }
  end

  def existence
    errors.add :email, :taken if ::Admin::User.where.not(id: admin_user.id).where(email: email).exists?
  end
end
