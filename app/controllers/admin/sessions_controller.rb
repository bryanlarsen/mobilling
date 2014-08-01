class Admin::SessionsController < Admin::ApplicationController
  def new
    @interactor = CreateAdminSession.new
  end

  def create
    @interactor = CreateAdminSession.new(session_params)
    if @interactor.perform
      sign_in(@interactor.user)
      redirect_to root_url
    else
      render :new
    end
  end

  def destroy
    sign_out
    redirect_to root_url
  end

  private

  def session_params
    params.require(:create_admin_session).permit(:email, :password)
  end
end
