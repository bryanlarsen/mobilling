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
end
