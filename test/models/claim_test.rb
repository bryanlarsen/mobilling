require "test_helper"

class ClaimTest < ActiveSupport::TestCase
  setup do
    @claim = build(:claim)
  end

  test "saves successfully with valid attributes" do
    assert @claim.save!
  end
end
