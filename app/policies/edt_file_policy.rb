class EdtFilePolicy < Struct.new(:current_user, :file)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return scope.none if current_user.blank?
      return scope.includes(:user).where(users: {agent_id: current_user.id}) if current_user.agent?
      return scope.where(user_id: current_user.id)
    end
  end

  def show?
    current_user.id == file.user_id || file.user.agent_id == current_user.id
  end

  def update?
    current_user.id == file.user_id || file.user.agent_id == current_user.id
  end

  def create?
    current_user.present?
  end
end
