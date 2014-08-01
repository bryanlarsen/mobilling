class Admin::ApplicationController < ActionController::Base
  layout "admin"

  include CurrentAdminUser
end
