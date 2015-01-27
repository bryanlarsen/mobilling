require "test_helper"

class V1::UsersControllerTest < ActionController::TestCase
  test "show renders template" do
    user = create(:user, name: "Jim")
    @controller.sign_in(user, user.authentication_token)
    get :show, id: user.id, format: "json"
    assert_equal "Jim", JSON::parse(response.body)["name"]
    assert_response :ok
  end

  test "show responds with unauthorized" do
    user = create(:user, name: "Jim")
    get :show, id: user.id, format: "json"
    assert_response :unauthorized
  end

  test "create responds with created" do
    agent = create(:agent)
    post :create, user: attributes_for(:user).merge(agent_id: agent.id), format: "json"
    assert_equal agent.id, JSON::parse(response.body)["agent_id"]
    assert_response :ok
  end

  test "create responds with unprocessable entity" do
    post :create, user: attributes_for(:user).merge(name: ""), format: "json"
    assert_response :unprocessable_entity
  end

  test "update responds correctly" do
    user = create(:user, name: "Jim")
    @controller.sign_in(user, user.authentication_token)
    put :update, id: user.id, format: "json", user: {name: "Bob"}
    assert_equal 'Bob', JSON::parse(response.body)["name"]
    assert_response :ok
  end

  test "update responds with unprocessable entity" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    post :update, id: user.id, user: {name: ""}, format: "json"
    assert_response :unprocessable_entity
  end

  test "update responds with unauthorized" do
    user = create(:user)
    post :update, id: user.id, user: {name: ""}, format: "json"
    assert_response :unauthorized
  end

  test "agent can update user" do
    agent = create(:agent)
    user = create(:user, name: "Jim", agent: agent)
    @controller.sign_in(agent, agent.authentication_token)
    put :update, id: user.id, format: "json", user: {name: "Bob"}
    assert_equal 'Bob', JSON::parse(response.body)["name"]
    assert_response :ok
  end

  test "agent can not update other user" do
    agent = create(:agent)
    agent2 = create(:agent)
    user = create(:user, name: "Jim", agent: agent2)
    @controller.sign_in(agent, agent.authentication_token)
    put :update, id: user.id, format: "json", user: {name: "Bob"}
    assert_response :not_found
  end

  test "admin can update user" do
    agent = create(:agent)
    user = create(:user, name: "Jim", agent: agent)
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    put :update, id: user.id, format: "json", user: {name: "Bob"}
    assert_equal 'Bob', JSON::parse(response.body)["name"]
    assert_response :ok
  end

  test "update cannot make admin" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    post :update, id: user.id, user: {role: "admin"}, format: "json"
    assert_response :unprocessable_entity
  end

end
