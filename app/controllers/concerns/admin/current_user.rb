module Admin::CurrentUser
  extend ActiveSupport::Concern

  class SessionExpired < StandardError; end

  SESSION_TIMEOUT = 15.minutes

  included do
    helper_method :current_user
    before_action :refresh_session
  end

  def current_user_id
    user_id, expires_at = cookies.permanent.encrypted[:user]
    return nil if user_id.blank?
    raise SessionExpired, "You have been logged out due to inactivity." if expires_at.blank? or expires_at <= Time.now
    user_id
  end

  def current_user_id=(user_id)
    cookies.permanent.encrypted[:user] = (user_id.present?) ? [user_id, SESSION_TIMEOUT.from_now] : nil
  end

  def refresh_session
    sign_in(current_user_id)
  rescue SessionExpired => exception
    sign_out
    redirect_to new_admin_session_path, alert: exception.message
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = Admin::User.find_by(id: current_user_id)
  end

  def sign_in(user)
    user_id = user.respond_to?(:id) ? user.id : user
    self.current_user_id = user_id
  end

  def sign_out
    self.current_user_id = nil
  end
end
