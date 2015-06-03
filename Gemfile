source "https://rubygems.org"

ruby "2.2.2"

gem 'bundler', '>= 1.8.4'

gem "rails", "4.2.1"

gem "apipie-rails"
gem "bcrypt"
gem "carrierwave"
gem "coffee-rails"
gem "email_validator"
gem "holidays"
gem "jbuilder"
gem "jquery-rails"
gem "less-rails"
gem "less-rails-bootstrap"
gem "mini_magick"
gem "oj"
gem "oj_mimic_json"
gem "pg"
gem "pundit", github: "elabs/pundit"
gem "rack-cors", :require => 'rack/cors'
gem "react-rails", github: 'reactjs/react-rails', branch: 'master'
gem "redcarpet"
gem "responders"
gem "rollbar"
gem "sass-rails"
gem "sprockets-redirect"
gem "sprockets", "~> 2.12"
gem "therubyracer"
gem "turbolinks"
gem "uglifier"
gem "uuid_validator"
gem "unicorn"
gem "validation_scopes", github: "ivalkeen/validation_scopes"
gem "virtus"

group :development do
  gem "letter_opener"
  gem "spring"
  gem "web-console", "~> 2.0.0.beta2"
end

group :test do
  gem "phantomjs"
  gem "capybara"
  gem "database_cleaner"
  gem "factory_girl_rails"
  gem "poltergeist"
end

group :development, :test do
  gem "byebug"
  gem "teaspoon", "~> 0.9"
end

group :staging, :production do
  gem "rack-cache"
end
