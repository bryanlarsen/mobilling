class SessionPolicy < Struct.new(:current_user, :session)
  def create?
    current_user.blank?
  end

  def destroy?
    current_user.present?
  end
end
