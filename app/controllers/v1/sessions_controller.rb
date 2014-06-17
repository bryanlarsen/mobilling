class V1::SessionsController < V1::BaseController
  skip_before_action :authenticate, only: %i[create]

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
