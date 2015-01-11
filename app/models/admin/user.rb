class Admin::User < ActiveRecord::Base
  self.table_name = "users"
  has_secure_password validations: false
  enum role: %i[doctor agent admin ministry]
  default_scope { where("role in (:roles)", roles: [roles["agent"], roles["admin"]]) }
end
