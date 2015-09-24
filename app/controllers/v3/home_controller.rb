class V3::HomeController < V3::BaseController
  skip_before_filter :refresh_session, :only => [:login]
  layout "v3_react"

  def pundit_user
    return nil if action_name == 'login'
    current_user
  end

  def login
    authorize :home, :login?
  end

  def show
    authorize :home, :read?
  end
end
