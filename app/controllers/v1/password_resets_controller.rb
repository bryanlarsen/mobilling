class V1::PasswordResetsController < V1::BaseController
  skip_before_action :require_user, only: %i[create]
  wrap_parameters :password_reset, include: [:email], format: :json
  resource_description { resource_id "password_resets" }

  api :POST, "/v1/password_reset", "Sens password reset instructions"
  param :password_reset, Hash, required: true do
    param :email, String, desc: "Email", required: true
  end

  def create
    @interactor = CreatePasswordReset.new(create_password_reset_params)
    @interactor.perform
    respond_with @interactor, location: nil, status: :created
  end

  private

  def create_password_reset_params
    params.require(:password_reset).permit(:email)
  end
end
