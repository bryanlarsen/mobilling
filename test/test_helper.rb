ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"
require "test_user_helper"
require "capybara/rails"
require "capybara/poltergeist"

DatabaseCleaner.strategy = :deletion

class ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods

  def assert_invalid(model, attribute = nil, message = nil)
    assert model.invalid?, message
    assert model.errors[attribute].present?, message if attribute.present?
  end

  def file_fixture(path)
    Rails.root.join("test", "fixtures", path)
  end
end

class ActionController::TestCase
  include ActionMailer::TestHelper

  def json_response
    JSON.parse(response.body)
  end
end

class ActionDispatch::IntegrationTest
  include ActionMailer::TestHelper

  # Stop ActiveRecord from wrapping tests in transactions
  self.use_transactional_fixtures = false

  def emails
    ActionMailer::Base.deliveries
  end

  def short_messages
    ShortMessageService.deliveries
  end

  teardown do
    DatabaseCleaner.clean
    Test::SessionPool.release
  end
end
