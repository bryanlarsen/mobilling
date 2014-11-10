class V1::SessionsController < V1::BaseController
  skip_before_action :require_user, only: %i[create]
  wrap_parameters :session, include: [:email, :password], format: :json
  resource_description { resource_id "sessions" }

  api :POST, "/v1/session", "Returns an authentication token"
  param :session, Hash, required: true do
    param :email, String, desc: "Email", required: true
    param :password, String, desc: "Password", required: true
  end

  def create
    @interactor = CreateSession.new(create_session_params)
    @interactor.perform
    render json: @interactor.user.for_json
  end

  api :DELETE, "/v1/session", "Deletes an authentication token"
  def destroy
    @user = current_user
    @user.update!(authentication_token: nil)
    render json: @user.for_json
  end

  private

  def create_session_params
    params.require(:session).permit(:email, :password)
  end
end
