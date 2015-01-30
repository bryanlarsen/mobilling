# hospitals, service_codes, etc.

class PublicPolicy < Struct.new(:current_user, :record)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      scope.all
    end
  end

  def create?
    current_user.admin?
  end

  def admin?
    current_user.admin?
  end

  def read?
    true
  end

  def destroy?
    current_user.admin?
  end

  def logged_in?
    current_user.present?
  end
end
