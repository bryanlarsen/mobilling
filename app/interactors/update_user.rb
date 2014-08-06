class UpdateUser
  include ActiveModel::Model

  attr_accessor :email, :name, :agent_id, :password
  attr_reader :user

  validates :email, presence: true, email: true
  validates :agent_id, presence: true
  validates :name, presence: true
  validate :existence

  def initialize(user, attributes = nil)
    @user = user
    self.name = @user.name
    self.email = @user.email
    self.agent_id = @user.agent_id
    super(attributes)
  end

  def perform
    if valid?
      @user.update!(user_attributes)
    else
      false
    end
  end

  private

  def user_attributes
    {
      name: name,
      email: email.to_s.downcase,
      password: password,
      agent_id: agent_id
    }
  end

  def existence
    errors.add :email, :taken if User.where.not(id: user.id).where(email: email.to_s.downcase).exists?
  end
end
