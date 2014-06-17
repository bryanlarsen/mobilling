class V1::UsersController < V1::BaseController
  skip_before_action :authenticate, only: %i[create]

  def show
    @user = @current_user
  end

  def create
    @interactor = CreateUser.new(create_user_params)
    @interactor.perform
    respond_with @interactor, location: nil, status: :created
  end

  private

  def create_user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
