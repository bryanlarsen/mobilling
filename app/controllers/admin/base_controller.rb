class Admin::BaseController < ActionController::Base
  include Pundit
  include CurrentUser
  layout "admin"

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    redirect_to new_admin_session_url, error: "You are not authorized to perform this action."
  end
end
