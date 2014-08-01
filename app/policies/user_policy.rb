class UserPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      ::User.includes(:agent)
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
