class UserPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      case current_user.role
      when "admin" then ::User.where(role: Roles["doctor"])
      when "agent" then ::User.where(agent_id: current_user.id)
      when "doctor" then ::User.where(id: current_user.id)
      else ::User.none
      end
    end
  end

  def read?
    current_user.present?
  end

  def update?
    current_user.present?
  end

  def destroy?
    current_user.present? and current_user.admin?
  end
end
