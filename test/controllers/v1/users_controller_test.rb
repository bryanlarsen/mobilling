require "test_helper"

class V1::UsersControllerTest < ActionController::TestCase
  test "show renders template" do
    user = create(:user, :authenticated)
    get :show, auth: user.authentication_token, format: "json"
    assert_template "show"
  end

  test "show responds with unauthorized" do
    get :show, format: "json"
    assert_response :unauthorized
  end

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

  test "update responds with unprocessable entity" do
    user = create(:user, :authenticated)
    post :update, auth: user.authentication_token, user: {name: ""}, format: "json"
    assert_response :unprocessable_entity
  end

  test "update responds with unauthorized" do
    post :update, user: {name: ""}, format: "json"
    assert_response :unauthorized
  end
end
