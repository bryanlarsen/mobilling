require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = build(:user)
  end

  test "saves successfully with valid attributes" do
    assert @user.save!
  end
end
