require File.expand_path("../boot", __FILE__)

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MoBilling
  class Application < Rails::Application
    config.middleware.use "AuthOverride"
    config.angular_templates.module_name = "moBilling.templates"
    config.assets.version = "1.1"
  end
end
