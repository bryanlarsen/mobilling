class V1::BaseController < ActionController::Base
  include Pundit
  respond_to :json

  before_action :require_user
  helper_method :current_user
  helper_method :current_user_id

  rescue_from ActionController::ParameterMissing do |exception|
    render json: {error: exception.message}, status: :bad_request
  end

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render json: {error: exception.message}, status: :not_found
  end

  rescue_from ActiveRecord::RecordNotUnique do |exception|
    render json: {error: exception.message}, status: :unprocessable_entity
  end

  private

  def authentication_token
    params[:auth]
  end

  def current_user_id
    return @current_user.id if @current_user
    user_id, expires_at = cookies.permanent.encrypted[:user]
    return nil if user_id.blank?
    raise SessionExpired, "You have been logged out due to inactivity." if expires_at.blank? or expires_at <= Time.now
    user_id
  end

  def current_user
    @current_user ||= User.find_by(authentication_token: authentication_token) if authentication_token.present?
    @current_user ||= User.find_by(id: current_user_id)
  end

  def require_user
    return if current_user.present?
    render json: {error: "param is missing or the value is invalid: auth"}, status: :unauthorized
  end
end
