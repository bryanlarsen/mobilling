class V1::RequestPasswordResetsController < V3::BaseController
  skip_before_filter :refresh_session, :only => [:create]
  skip_before_filter :verify_authenticity_token, :only => [:create]

  def pundit_user
    nil
  end

  def create
    authorize :home, :login?
    @interactor = CreatePasswordReset.new(create_password_reset_params)
    if @interactor.perform
      render json: {notice: "Password reset email sent."}
    else
      render status: 422, json: {errors: {email: ["Problem sending email."]}}
    end
  end

  private

  def create_password_reset_params
    params.require(:create_password_reset).permit(:email)
  end
end
