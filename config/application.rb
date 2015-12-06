require File.expand_path("../boot", __FILE__)

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MoBilling
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true # surpress carrierwave deprecation warnings
    config.active_support.test_order = :sorted
    config.assets.paths << Rails.root.join('vendor', 'assets', 'components')

    config.action_mailer.delivery_method = :postmark
    config.action_mailer.postmark_settings = { api_token: "d1c57c80-955a-4d96-9180-ad5535e58a0a" }
#    config.react.addons = true
#    config.react.jsx_transform_options = {
#      harmony: true,
#      strip_types: true, # for removing Flow type annotations
    #    }

    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins '*'
        resource '*', :headers => :any, :methods => [:get, :post, :options, :put]
      end
    end
  end
end
