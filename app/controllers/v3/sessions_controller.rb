class V3::SessionsController < V3::BaseController
  layout "v3_rails"

  skip_before_filter :refresh_session, :only => [:new, :create]
  skip_after_filter :verify_authorized, :only => [:new, :create]

  def new
    @interactor3 = V3::CreateSession.new
  end

  def create
    @interactor3 = V3::CreateSession.new(session_params)
    if @interactor3.perform
      sign_in(@interactor3.user, @interactor3.token)
    else
      render :new
      return
    end
    redirect_to @interactor3.user.doctor? ? root_url : admin_dashboard_url
  end

  def destroy
    authorize :session
    sign_out
    redirect_to root_url
  end

  private

  def session_params
    params.require(:v3_create_session).permit(:email, :password)
  end
end
