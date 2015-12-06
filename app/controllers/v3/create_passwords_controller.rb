class V3::CreatePasswordsController < V3::BaseController
  layout "v3_rails"

  skip_before_filter :refresh_session, :only => [:new]

  def new
    authorize :public, :read?
    @interactor = CreatePassword.new(token: params[:token])
    if @interactor.perform
      flash[:notice] = "A new password has been created and mailed to you.   Please check your email again."
    else
      flash[:error] = "Problem sending email."
    end
    redirect_to new_session_url
  end
end
