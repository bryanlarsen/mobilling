class CreateUser
  include ActiveModel::Model

  attr_accessor :email, :password, :name, :agent_id
  attr_reader :user

  validates :email, presence: true, email: true
  validates :agent_id, presence: true
  validates :password, presence: true
  validates :name, presence: true
  validate :email_existence

  def perform
    @user = User.new
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
      email: email.to_s.downcase,
      password: password,
      agent_id: agent_id,
      authentication_token: SecureRandom.hex(32)
    }
  end

  def email_existence
    errors.add :email, :taken if User.where(email: email.to_s.downcase).exists?
  end
end
