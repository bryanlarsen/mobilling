require "test_helper"

class V3::CreatePasswordsControllerTest < ActionController::TestCase
  test "renders error template when no token" do
    post :new
    assert flash[:error]
    assert !flash[:notice]
  end

  test "renders error template when invalid token" do
    get :new, token: "invalid"
    assert flash[:error]
    assert !flash[:notice]
  end

  test "renders success template" do
    create(:user, email: "alice@example.com", password: "secret")
    interactor = CreatePasswordReset.new(email: "alice@example.com")
    interactor.perform
    get :new, token: interactor.token
    assert !flash[:error]
    assert flash[:notice]
  end
end
