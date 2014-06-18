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
    respond_with @interactor, location: nil, status: :created
  end

  private

  def create_session_params
    params.require(:session).permit(:email, :password)
  end
end
