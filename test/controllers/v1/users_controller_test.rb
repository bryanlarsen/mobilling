require "test_helper"

class V1::UsersControllerTest < ActionController::TestCase
  test "create responds with created" do
    agent = create(:admin_user, role: "agent")
    post :create, user: attributes_for(:user).merge(agent_id: agent.id), format: "json"
    assert_response :created
  end

  test "create responds with unprocessable entity" do
    post :create, user: attributes_for(:user).merge(name: ""), format: "json"
    assert_response :unprocessable_entity
  end

  test "update responds correctly" do
    user = create(:user, :authenticated)
    put :update, auth: user.authentication_token, format: "json", user: {name: "Bob"}
    assert_template "update"
  end
end
