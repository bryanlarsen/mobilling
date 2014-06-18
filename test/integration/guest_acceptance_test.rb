require "test_helper"

class GuestAcceptanceTest < ActionDispatch::IntegrationTest
  setup do
    @guest = Test::Guest.new
  end

  test "can sign up" do
    @guest.visit(root_path)
    # @guest.click_on("Create account now")
    # @guest.fill_in("Name", with: "Alice")
    # @guest.fill_in("Email", with: @guest.email)
  end
end
