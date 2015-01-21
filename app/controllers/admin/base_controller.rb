class Admin::BaseController < ActionController::Base
  include Pundit
  include V3::CurrentUser
  layout "admin"

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    session[:admin] = true
    redirect_to new_session_url, error: "You are not authorized to perform this action."
  end
end
