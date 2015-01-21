class V3::RequestPasswordResetsController < V3::BaseController
  layout "v3_rails"

  skip_before_filter :refresh_session, :only => [:new, :create]

  def new
    @interactor = CreatePasswordReset.new
  end

  def create
    @interactor = CreatePasswordReset.new(create_password_reset_params)
    if @interactor.perform
      flash[:notice] = "Password reset email sent."
    else
      flash[:error] = "Problem sending email."
    end
    redirect_to root_url
  end

  private

  def create_password_reset_params
    params.require(:create_password_reset).permit(:email)
  end
end
