class UserPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      scope = ::User.includes(:agent)
      scope = scope.where(admin_users: {id: current_user.id})
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
    current_user.present?
  end
end
