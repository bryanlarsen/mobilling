class V1::SessionsController < V1::BaseController
  skip_before_action :authenticate, only: %i[create]

  resource_description do
    resource_id "sessions"
  end

  api :POST, "/v1/session", "Returns an authentication token"
  param :session, Hash, required: true do
    param :email, String, desc: "Email", required: true
    param :password, String, desc: "Password", required: true
  end

  def create
    @session = CreateUserSession.new(session_params)
    @session.perform
    respond_with @session, location: nil, status: :created
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
