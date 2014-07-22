class V1::UsersController < V1::BaseController
  skip_before_action :require_user, only: %i[create]
  wrap_parameters :user, include: [:name, :email, :password, :agent_id], format: :json
  resource_description { resource_id "users" }

  api :GET, "/v1/user/doctors", "Returns doctors"

  def doctors
    @users = User.all
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
    @interactor = CreateUser.new(update_user_params)
    @interactor.perform
    respond_with @interactor, location: nil, status: :created
  end

  api :PUT, "/v1/claims/:id", "Updates a claim"
  param :user, Hash do
    param :name, String, required: true
    param :email, String, required: true
    param :agent_id, String
  end

  def update
    @interactor = UpdateUser.new(
      {user: current_user}.merge!(update_user_params)
    )
    @interactor.perform
    respond_with @interactor, location: nil
  end

  private

  def update_user_params
    params.require(:user).permit(:name, :email, :password, :agent_id)
  end
end
