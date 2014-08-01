class SessionPolicy < Struct.new(:user, :session)
  def create?
    user.blank?
  end

  def destroy?
    user.present?
  end
end
