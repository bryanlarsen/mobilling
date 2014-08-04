require "test_helper"

class AdminTest < ActionDispatch::IntegrationTest
  setup do
    @admin = Test::Admin.new
    @admin.sign_in
  end

  test "admin can change patient name in claim" do
    create(:claim)
    @admin.navigate_to "Claims"
    @admin.click_on "Edit"
    @admin.fill_in "Patient Name", with: "Bob"
    @admin.click_on "Update"
    @admin.see?("Bob")
  end

  test "admin can change doctor name" do
    create(:user)
    @admin.navigate_to "Users"
    @admin.click_on "Edit"
    @admin.fill_in "Name", with: "Bob"
    @admin.click_on "Update"
    @admin.see?("Bob")
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
