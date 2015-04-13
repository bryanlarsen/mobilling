class Admin::BaseController < ActionController::Base
  include Pundit
  include V3::CurrentUser
  layout "admin"

  protect_from_forgery with: :exception
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from V3::CurrentUser::SessionExpired, with: :session_expired

  after_action :verify_authorized, :except => :index
  after_action :verify_policy_scoped, :only => :index

  private

  def session_expired(ex)
    flash[:error] = ex.to_s
    redirect_to new_session_url, error: ex.to_s
  end

  def user_not_authorized
    redirect_to new_session_url, error: "You are not authorized to perform this action."
  end
end
