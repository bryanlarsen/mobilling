class V1::UsersController < V1::BaseController
  skip_before_action :require_user, only: %i[create]

  resource_description do
    resource_id "users"
  end

  api :GET, "/v1/user", "Returns the current user"

  def show
    @user = @current_user
  end

  api :POST, "/v1/user", "Creates a new user"
  param :user, Hash, required: true do
    param :name, String, desc: "Name", required: true
    param :email, String, desc: "Email", required: true
    param :password, String, desc: "Password", required: true
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
