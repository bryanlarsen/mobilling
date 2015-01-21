class V1::BaseController < ActionController::Base
  include Pundit
  include V3::CurrentUser
  respond_to :json

  before_action :require_user

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

  def require_user
    return if current_user.present?
    render json: {error: "param is missing or the value is invalid: auth"}, status: :unauthorized
  end
end
