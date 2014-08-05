class AdminUserPolicy < Struct.new(:current_user, :admin_user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      case current_user.try(:role)
      when nil then ::Admin::User.none
      when "agent" then ::Admin::User.where(id: current_user.id)
      when "admin" then ::Admin::User.all
      end
    end
  end

  def read?
    current_user.present?
  end

  def create?
    current_user.present? and current_user.admin?
  end

  def update?
    current_user.present?
  end

  def destroy?
    current_user.present? and current_user.admin?
  end
end
