require "test_helper"

class V1::SessionsControllerTest < ActionController::TestCase
  test "create responds with created" do
    user = create(:user)
    post :create, session: {email: user.email, password: user.password}, format: "json"
    assert_response :created
  end

  test "create responds with unprocessable entity" do
    post :create, session: {email: "non-existing@example.com", password: "secret"}, format: "json"
    assert_response :unprocessable_entity
  end
end
