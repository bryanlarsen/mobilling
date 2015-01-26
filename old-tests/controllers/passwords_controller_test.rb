require "test_helper"

class PasswordsControllerTest < ActionController::TestCase
  test "renders error template when no token" do
    get :new
    assert_template "error"
  end

  test "renders error template when invalid token" do
    get :new, token: "invalid"
    assert_template "error"
  end

  test "renders success template" do
    create(:user, email: "alice@example.com", password: "secret")
    interactor = CreatePasswordReset.new(email: "alice@example.com")
    interactor.perform
    get :new, token: interactor.token
    assert_template "success"
  end
end
