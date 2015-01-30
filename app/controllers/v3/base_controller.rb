class V3::BaseController < ActionController::Base
  include Pundit
  include V3::CurrentUser

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  after_action :verify_authorized, :except => :index
  after_action :verify_policy_scoped, :only => :index

  private

  def user_not_authorized
    redirect_to new_session_url, error: "You are not authorized to perform this action."
  end
end
