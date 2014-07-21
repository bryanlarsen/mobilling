class UpdateUser
  include ActiveModel::Model

  attr_accessor :id, :email, :password, :name, :agent_id, :role
  attr_reader :user

  validates :email, presence: true, email: true
  validates :name, presence: true
  validates :id, presence: true

  def perform
    @user = User.find(id)
    if valid?
      @user.update!(
        name: name,
        email: email,
        agent_id: agent_id
      )
    else
      false
    end
  end

end
