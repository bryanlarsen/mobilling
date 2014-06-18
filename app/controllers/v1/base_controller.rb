class V1::BaseController < ActionController::Base
  respond_to :json

  before_action :require_user
  helper_method :current_user

  private

  def authentication_token
    params[:auth]
  end

  def current_user
    return @current_patient if defined?(@current_patient)
    @current_user = User.find_by(authentication_token: authentication_token)
  end

  def require_user
    return if current_user.present?
    render json: {error: "param is missing or the value is invalid: auth"}, status: :unauthorized
  end
end
