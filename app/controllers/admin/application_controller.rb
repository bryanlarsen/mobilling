class Admin::ApplicationController < ActionController::Base
  include Pundit
  include CurrentUser
  layout "admin"
end
