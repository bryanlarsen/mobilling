module V3::CurrentUser
  extend ActiveSupport::Concern

  class SessionExpired < StandardError; end

  SESSION_TIMEOUT = 24.hours

  included do
    helper_method :current_user
    before_action :refresh_session
  end

  def refresh_session
    current_user
  rescue SessionExpired => exception
    redirect_to new_session_path, alert: exception.message
  end

  def current_user
    return @current_user if defined?(@current_user)
    return nil if session[:user_id].blank?
    return nil if session[:token].blank?
    user = ::User.find_by(id: session[:user_id])
    raise SessionExpired, "You have logged in elsewhere." if session[:token] != user.authentication_token
    raise SessionExpired, "You have been logged out due to inactivity." if user.token_at.blank? or user.token_at + SESSION_TIMEOUT <= DateTime.now
    @current_user = user
  end

  def sign_in(user, token)
    user_id = user.respond_to?(:id) ? user.id : user
    reset_session
    session[:user_id] = user_id
    session[:token] = token
  end

  def sign_out
    reset_session
  end
end
