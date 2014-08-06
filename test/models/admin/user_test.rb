require "test_helper"

class Admin::UserTest < ActiveSupport::TestCase
  setup do
    @admin_user = build(:admin_user)
  end

  test "saves successfully with valid attributes" do
    assert @admin_user.save!
  end
end
