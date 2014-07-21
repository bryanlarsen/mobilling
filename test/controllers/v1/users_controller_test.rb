require "test_helper"

class V1::UsersControllerTest < ActionController::TestCase
  test "create responds with a status of created" do
    post :create, user: attributes_for(:user), format: "json"
    assert_response :created
  end

  test "create responds with unprocessable entity" do
    post :create, user: attributes_for(:user).merge(name: ""), format: "json"
    assert_response :unprocessable_entity
  end

  test "update responds with unauthorized when no auth" do
    uuid = SecureRandom.uuid
    put :update, id: uuid, format: "json", user: {id: uuid}
    assert_response :unauthorized
  end

  test "update responds with unprocessable entity when invalid params" do
    user = create(:user, :authenticated)
    put :update, id: "invalid", format: "json", user: {id: "invalid"}, auth: user.authentication_token
    assert_response :unprocessable_entity
  end
end
