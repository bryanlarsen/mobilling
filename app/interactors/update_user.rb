class UpdateUser
  include ActiveModel::Model

  attr_accessor :user, :email, :password, :name, :agent_id, :role

  validates :email, presence: true, email: true
  validates :name, presence: true
  validates :user, presence: true

  def perform
    if valid?
      user.update!(
        name: name,
        email: email,
        agent_id: agent_id
      )
      user.role = role if role
      user.password = password if password
      user.save!
    else
      false
    end
  end

end
