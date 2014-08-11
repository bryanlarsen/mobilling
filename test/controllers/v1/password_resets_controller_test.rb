require "test_helper"

class V1::PasswordResetsControllerTest < ActionController::TestCase
  test "create responds with created" do
    user = create(:user)
    post :create, password_reset: {email: user.email}, format: "json"
    assert_response :created
  end

  test "create responds with unprocessable entity" do
    post :create, password_reset: {email: "non-existing@example.com"}, format: "json"
    assert_response :unprocessable_entity
  end
end
