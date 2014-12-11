class V1::UsersController < V1::BaseController
  skip_before_action :require_user, only: %i[create]
  wrap_parameters :user, include: [:name, :email, :password, :agent_id, :pin, :specialties, :provider_number, :group_number, :office_code, :specialty_code], format: :json
  resource_description { resource_id "users" }

  api :GET, "/v1/user", "Returns the current user"

  def show
    render json: @current_user
  end

  api :POST, "/v1/user", "Creates a new user"
  param :user, Hash, required: true do
    param :name, String, desc: "Name", required: true
    param :email, String, desc: "Email", required: true
    param :agent_id, String, desc: "Agent ID", required: true
    param :specialties, Array, desc: "Specialties", required: true
    param :password, String, desc: "Password", required: true
    param :provider_number, Integer, desc: "OHIP Provider Number"
    param :group_number, String, desc: "OHIP Group Code"
    param :office_code, Integer, desc: "MOH Office Code"
    param :specialty_code, Integer, desc: "OHIP Specialty Code"
  end

  def create
    @interactor = CreateUser.new(create_user_params)
    if @interactor.perform
      render json: @interactor.user
    else
      render json: @interactor, status: 422
    end
  end

  api :PUT, "/v1/user", "Updates a user"
  param :user, Hash do
    param :name, String, desc: "Name", required: true
    param :email, String, desc: "Email", required: true
    param :agent_id, String, desc: "Agent ID", required: true
    param :specialties, Array, desc: "Specialties", required: true
    param :password, String, desc: "Password"
    param :pin, String, desc: "PIN"
    param :provider_number, Integer, desc: "OHIP Provider Number"
    param :group_number, String, desc: "OHIP Group Number"
    param :office_code, Integer, desc: "MOH Office COde"
    param :specialty_code, Integer, desc: "OHIP Specialty Code"
  end

  def update
    @user = @current_user
    @interactor = UpdateUser.new(@user, update_user_params)
    if @interactor.perform
      render json: @interactor.user
    else
      render json: @interactor, status: 422
    end
  end

  private

  def create_user_params
    params.require(:user).permit(:name, :email, :password, :agent_id, :provider_number, :group_number, :office_code, :specialty_code, specialties: [])
  end

  def update_user_params
    params.require(:user).permit(:name, :email, :password, :agent_id, :provider_number, :group_number, :office_code, :specialty_code, :pin, specialties: [])
  end
end
