class V3::SessionsController < V3::BaseController
  layout "v3_rails"

  def new
    @interactor = V3::CreateSession.new
    authorize :session, :create?
  end

  def create
    authorize :session, :create?
    @interactor3 = V3::CreateSession.new(session_params)
    if @interactor3.perform
      sign_in(@interactor.user)
    else
      render :new
      return
    end
    @interactor1 = CreateSession.new(create_session_params)
    if !@interactor1.perform
      render :new
      return
    end
    redirect_to v3_root_url
  end

  def destroy
    authorize :session, :destroy?
    sign_out
    redirect_to root_url
  end

  private

  def session_params
    params.require(:v3_create_session).permit(:email, :password)
  end
end
