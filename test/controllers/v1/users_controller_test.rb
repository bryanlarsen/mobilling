require "test_helper"

class V1::UsersControllerTest < ActionController::TestCase
  test "create responds with created" do
    post :create, user: attributes_for(:user), format: "json"
    assert_response :created
  end

  test "create responds with unprocessable entity" do
    post :create, user: attributes_for(:user).merge(name: ""), format: "json"
    assert_response :unprocessable_entity
  end

  test "update responds correctly" do
    user = create(:user, :authenticated)
    uuid = SecureRandom.uuid
    put :update, id: uuid, auth: user.authentication_token, format: "json", claim: {id: uuid, status: "saved"}
    assert_template "update"
  end
end
