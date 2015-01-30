class PhotoPolicy < Struct.new(:current_user, :photo)
  def access?
    UserPolicy.new(current_user, photo.user).access?
  end

  def create?
    current_user.present?
  end

  def show?
    access?
  end
end
