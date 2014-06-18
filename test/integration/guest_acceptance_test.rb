require "test_helper"

class GuestAcceptanceTest < ActionDispatch::IntegrationTest
  setup do
    @guest = Test::Guest.new
  end

  test "can sign up" do
    @guest.visit(root_path)
    @guest.click_on("Create account now")
    @guest.fill_in("Name", with: "Alice")
    @guest.fill_in("Email", with: "alice@example.com")
    @guest.fill_in("Password", with: "secret")
    @guest.fill_in("Confirm password", with: "secret")
    @guest.click_on("Create Account")
    assert @guest.see?("MENU")
  end

  test "can sign in" do
    user = create(:user, email: "alice@example.com", password: "secret")
    @guest.visit(root_path)
    @guest.fill_in("Email", with: user.email)
    @guest.fill_in("Password", with: user.password)
    @guest.click_on("Sign In")
    assert @guest.see?("MENU")
  end
end
