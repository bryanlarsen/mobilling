require "test_helper"

class V1::SessionsControllerTest < ActionController::TestCase
  test "create responds with created" do
    user = create(:user)
    post :create, session: {email: user.email, password: user.password}, format: "json"
    assert_response :ok
  end

  test "create responds with unprocessable entity" do
    post :create, session: {email: "non-existing@example.com", password: "secret"}, format: "json"
    assert_response :unprocessable_entity
  end

  test "destroy responds with created" do
    user = create(:user, :authenticated)
    delete :destroy, auth: user.authentication_token, format: "json"
    assert_response :ok
    assert user.reload.authentication_token.nil?
  end

  test "destroy responds with unauthorized when no auth" do
    delete :destroy, format: "json"
    assert_response :unauthorized
  end
end
