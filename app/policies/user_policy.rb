class UserPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return scope.none unless current_user.present?
      case current_user.role
      when "admin" then scope.all
      when "agent" then scope.where("agent_id = :id OR id = :id", {id: current_user.id})
      when "doctor" then scope.where(id: current_user.id)
      else scope.none
      end
    end
  end

  def access?
    return false unless current_user.present?
    case current_user.role
    when "doctor"
      current_user.id == user.id
    when "agent"
      user.agent_id == current_user.id || current_user.id == user.id
    when "admin"
      true
    else
      false
    end
  end

  def show?
    access?
  end

  def update?
    access?
  end

  def destroy?
    current_user.present? and current_user.admin?
  end

  def create?
    true
  end
end
