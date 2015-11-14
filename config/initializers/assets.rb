# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

Rails.application.config.assets.precompile += %w[*.png *.jpg *.otf *.eot *.svg *.ttf *.woff static.js react-bundle.js admin.css admin.js admin-react.js v3.css v3.js v3_rails.css v3_rails.js v3_rails-cleaned.css cordova.css ]
