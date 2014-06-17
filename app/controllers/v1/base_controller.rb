class V1::BaseController < ActionController::Base
  respond_to :json

  before_action :authenticate
  attr_reader :current_user
  helper_method :current_user

  private

  def authenticate
    authenticate_or_request_with_http_token do |token, options|
      @current_user = User.find_by(authentication_token: token)
    end
  end
end
