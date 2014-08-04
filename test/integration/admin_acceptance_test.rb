require "test_helper"

class AdminTest < ActionDispatch::IntegrationTest
  setup do
    @admin = Test::Admin.new
    @admin.sign_in
  end

  test "admin can remove a doctor" do
    create(:user, name: "House")
    @admin.navigate_to "Users"
    @admin.see?("House")
    @admin.within_row "House" do
      @admin.click_on "Edit"
    end
    @admin.click_on "Delete"
    assert @admin.not_see?("House")
  end
end
