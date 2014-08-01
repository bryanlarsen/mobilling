class Admin::SessionsController < Admin::ApplicationController
  def new
    @interactor = CreateAdminSession.new
    authorize :session, :create?
  end

  def create
    @interactor = CreateAdminSession.new(session_params)
    authorize :session, :create?
    if @interactor.perform
      sign_in(@interactor.user)
      redirect_to admin_root_url
    else
      render :new
    end
  end

  def destroy
    authorize :session, :destroy?
    sign_out
    redirect_to admin_root_url
  end

  private

  def session_params
    params.require(:create_admin_session).permit(:email, :password)
  end
end
