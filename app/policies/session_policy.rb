class SessionPolicy < Struct.new(:current_user, :session)
  def create?
    true
  end

  def destroy?
    current_user.present?
  end
end
