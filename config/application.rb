require File.expand_path("../boot", __FILE__)

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MoBilling
  class Application < Rails::Application
    config.angular_templates.module_name = "moBilling.templates"
    config.assets.paths << Rails.root.join("vendor", "assets", "fonts")
    config.assets.precompile = %w[*.png *.jpg *.eot *.svg *.ttf *.woff application.css application.js]
  end
end
