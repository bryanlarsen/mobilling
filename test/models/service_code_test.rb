require "test_helper"

class ServiceCodeTest < ActiveSupport::TestCase
  setup do
    @service_code = build(:service_code)
  end

  test "saves successfully with valid attributes" do
    assert @service_code.save!
  end
end
