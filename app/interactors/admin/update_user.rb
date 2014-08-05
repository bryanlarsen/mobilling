class Admin::UpdateUser
  include ActiveModel::Model

  attr_accessor :email, :password, :name, :agent_id
  attr_reader :user

  validates :email, presence: true, email: true
  validates :password, confirmation: true
  validates :name, presence: true
  validate :existence

  def initialize(user, attributes = nil)
    @user = user
    self.email = @user.email
    self.name = @user.name
    super(attributes)
  end

  def perform
    if valid?
      @user.update!(user_attributes)
    else
      false
    end
  end

  def persisted?
    true
  end

  private

  def user_attributes
    {
      name: name,
      password: password,
      agent_id: agent_id.presence || nil
    }
  end

  def existence
    errors.add :email, :taken if ::User.where.not(id: user.id).where(email: email).exists?
  end
end
