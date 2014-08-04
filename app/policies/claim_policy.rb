class ClaimPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      scope = ::Claim.includes(:user)
      scope = scope.where(users: {agent_id: current_user.id}) if current_user.agent?
      scope
    end
  end

  def read?
    current_user.present?
  end

  def update?
    current_user.present?
  end
end
