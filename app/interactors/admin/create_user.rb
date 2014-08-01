class Admin::CreateUser
  include ActiveModel::Model

  attr_accessor :email, :password, :name, :agent_id
  attr_reader :user

  validates :email, presence: true, email: true
  validates :password, presence: true, confirmation: true
  validates :name, presence: true
  validate :existence

  def perform
    @user = ::User.find_or_initialize_by(email: email.to_s.downcase)
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
      password: password,
      agent_id: agent_id.presence || nil
    }
  end

  def existence
    errors.add :email, :taken if user.persisted?
  end
end
