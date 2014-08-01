class UserPolicy < Struct.new(:current_user, :user)
  def read?
    current_user.present?
  end
end
