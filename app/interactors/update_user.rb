class UpdateUser
  include ActiveModel::Model

  attr_accessor :email, :name, :agent_id
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
      @user.update!(user_params)
    else
      false
    end
  end

  private

  def user_params
    {
      name: name,
      email: email,
      agent_id: agent_id,
    }
  end

  def existence
    errors.add :email, :taken if User.where.not(id: user.id).where(email: email).exists?
  end
end
