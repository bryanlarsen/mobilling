class User < ActiveRecord::Base
  module Roles
    extend ActiveSupport::Concern

    ALL = %w[doctor agent admin]

    included do
      validates :role, inclusion: {in: ALL}
      ALL.each { |role| scope role.pluralize, -> { where(role: role) } }
    end

    def role
      ActiveSupport::StringInquirer.new(self[:role] || "guest")
    end
  end
end
