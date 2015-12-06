class Claim::ItemPolicy < Struct.new(:current_user, :item)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return scope.none unless current_user.present?
      case current_user.role
      when "admin" then scope.all
      when "agent" then scope.joins(claims: :user).where(users: {agent_id: current_user.id})
      when "doctor" then scope.joins(claims: :user).where(user_id: current_user.id)
      else scope.none
      end
    end
  end

  def access?
    UserPolicy.new(current_user, item.claim.user).access?
  end

  def show?
    access?
  end
end

