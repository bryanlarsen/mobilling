ENV["RAILS_ENV"] ||= "test"
require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"

class ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods

  def assert_invalid(model, attribute = nil, message = nil)
    assert model.invalid?, message
    assert model.errors[attribute].present?, message if attribute.present?
  end
end
