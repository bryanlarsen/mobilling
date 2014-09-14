require File.expand_path("../boot", __FILE__)

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MoBilling
  class Application < Rails::Application
    config.angular_templates.module_name = "moBilling.templates"
    config.active_record.raise_in_transactional_callbacks = true # surpress carrierwave deprecation warnings
  end
end
