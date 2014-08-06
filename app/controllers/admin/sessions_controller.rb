class Admin::SessionsController < Admin::ApplicationController
  def new
    @interactor = Admin::CreateSession.new
    authorize :session, :create?
  end

  def create
    @interactor = Admin::CreateSession.new(session_params)
    authorize :session, :create?
    if @interactor.perform
      sign_in(@interactor.admin_user)
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
    params.require(:admin_create_session).permit(:email, :password)
  end
end
