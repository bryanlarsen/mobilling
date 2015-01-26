class UserPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return ::User.none unless current_user.present?
      case current_user.role
      when "admin" then ::User.all
      when "agent" then ::User.where("agent_id = :id OR id = :id", {id: current_user.id})
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
