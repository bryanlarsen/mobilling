class V3::HomeController < V3::BaseController
  skip_before_filter :refresh_session, :only => [:login, :root]
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
    @current_user = current_user
  end

  def root
    authorize :home, :login?
    @user = current_user rescue nil
    if current_user
      redirect_to current_user.doctor? ? '/claims' : '/admin'
    else
      render :file => File.join(Rails.root, 'public', 'home.html'),
             :layout => false
    end
  end
end
