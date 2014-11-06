class Admin::User < ActiveRecord::Base
  has_secure_password validations: false
  enum role: %i[agent admin ministry]
end
