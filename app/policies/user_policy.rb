class UserPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return ::User.none if current_user.blank?
      scope = ::User.includes(:agent)
      scope = scope.where(admin_users: {id: current_user.id}) if current_user.agent?
      scope
    end
  end

  def read?
    current_user.present?
  end

  def update?
    current_user.present?
  end

  def destroy?
    current_user.admin?
  end
end
