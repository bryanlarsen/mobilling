class Admin::BaseController < ActionController::Base
  include Pundit
  include V3::CurrentUser
  layout "admin"

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  after_action :verify_authorized, :except => :index
  after_action :verify_policy_scoped, :only => :index

  private

  def user_not_authorized
    session[:admin] = true
    redirect_to new_session_url, error: "You are not authorized to perform this action."
  end
end
