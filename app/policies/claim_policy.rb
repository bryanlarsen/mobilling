class ClaimPolicy < Struct.new(:current_user, :claim)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return scope.none unless current_user.present?
      case current_user.role
      when "admin" then scope.all
      when "agent" then scope.joins(:user).where(users: {agent_id: current_user.id})
      when "doctor" then scope.where(user_id: current_user.id)
      else scope.none
      end
    end
  end

  def access?
    UserPolicy.new(current_user, claim.user).access?
  end

  def create?
    current_user.present?
  end

  def new_item?
    access?
  end

  def show?
    access?
  end

  def update?
    access?
  end

  def destroy?
    access? && ['saved', 'for_agent', 'ready'].include?(claim.status)
  end
end

