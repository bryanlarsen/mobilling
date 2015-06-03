class V3::HomeController < V3::BaseController
  layout "v3_react"
  def login
    authorize :home, :login?
  end

  def show
    authorize :home, :read?
  end
end
