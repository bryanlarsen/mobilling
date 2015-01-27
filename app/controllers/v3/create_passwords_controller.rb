class V3::CreatePasswordsController < V3::BaseController
  layout "v3_rails"

  skip_before_filter :refresh_session, :only => [:new]

  def new
    @interactor = CreatePassword.new(token: params[:token])
    if @interactor.perform
      flash[:notice] = "New password email sent."
    else
      flash[:error] = "Problem sending email."
    end
    redirect_to root_url
  end
end
