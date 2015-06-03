class HomePolicy < Struct.new(:current_user, :user)
  def read?
    current_user.present?
  end

  def login?
    true
  end
end
