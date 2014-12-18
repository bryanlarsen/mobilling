class V3::HomeController < V3::BaseController
  layout "v3_react"
  def show
    authorize :home, :read?
    puts "current_user", current_user
  end
end
