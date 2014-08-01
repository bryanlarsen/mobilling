module CurrentAdminUser
  extend ActiveSupport::Concern

  class SessionExpired < StandardError; end

  SESSION_TIMEOUT = 15.minutes

  included do
    helper_method :current_admin_user
    before_action :refresh_session
  end

  def current_admin_user_id
    admin_user_id, expires_at = cookies.permanent.encrypted[:admin_user]
    return nil if admin_user_id.blank?
    raise SessionExpired, "You have been logged out due to inactivity." if expires_at.blank? or expires_at <= Time.now
    admin_user_id
  end

  def current_admin_user_id=(admin_user_id)
    cookies.permanent.encrypted[:admin_user] = (admin_user_id.present?) ? [admin_user_id, SESSION_TIMEOUT.from_now] : nil
  end

  def refresh_session
    sign_in(current_admin_user_id)
  rescue SessionExpired => exception
    sign_out
    redirect_to new_session_path, alert: exception.message
  end

  def current_admin_user
    return @current_admin_user if defined?(@current_admin_user)
    @current_admin_user = Admin::User.find_by(id: current_admin_user_id)
  end

  def sign_in(admin_user)
    admin_user_id = admin_user.respond_to?(:id) ? admin_user.id : admin_user
    self.current_admin_user_id = admin_user_id
  end

  def sign_out
    self.current_admin_user_id = nil
  end
end
