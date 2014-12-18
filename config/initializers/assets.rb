# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

Rails.application.config.assets.precompile += %w[*.png *.jpg *.otf *.eot *.svg *.ttf *.woff application.css application.js admin.css admin.js v3.css v3.js v3_rails.css v3_rails.js v3_rails-cleaned.css ]

if Rails.env.development?
  Rails.application.config.assets.precompile += %w[teaspoon.css teaspoon-teaspoon.js teaspoon-jasmine.js jasmine/1.3.1.js]
end
