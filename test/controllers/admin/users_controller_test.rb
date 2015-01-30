require "test_helper"

class Admin::UsersControllerTest < ActionController::TestCase
  test "index redirects to sign in when no user logged in" do
    get :index
    assert_redirected_to new_session_path
    assert session[:admin]
  end

  test "index renders template when admin logged in" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    get :index
    assert_template "index"
  end

  test "index assigns associated doctors when agent logged in" do
    agent = create(:agent)
    agent2 = create(:agent)
    associated = create(:user, agent: agent)
    unassociated = create(:user, agent: agent2)
    @controller.sign_in(agent, agent.authentication_token)
    get :index
    assert assigns(:users).include?(associated)
    refute assigns(:users).include?(unassociated)
  end

  test "index filters by agent_id" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    agent = create(:agent)
    agent2 = create(:agent)
    associated = create(:user, agent: agent)
    unassociated = create(:user, agent: agent2)
    @controller.sign_in(admin, admin.authentication_token)
    get :index, agent_id: agent.id
    assert assigns(:users).include?(associated)
    refute assigns(:users).include?(unassociated)
  end

  test "edit raises exception when no user logged in" do
    agent = create(:agent)
    user = create(:user, agent: agent)
    get :edit, id: user.id
    assert_redirected_to new_session_path
  end

  test "edit raises exception when unassociated user" do
    agent = create(:agent)
    agent2 = create(:agent)
    user = create(:user, agent: agent2)
    @controller.sign_in(agent, agent.authentication_token)
    get :edit, id: user.id
    assert_redirected_to new_session_path
  end

  test "edit renders template when admin logged in" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    user = create(:user)
    @controller.sign_in(admin, admin.authentication_token)
    get :edit, id: user.id
    assert_template "edit"
  end

  test "destroy raises exception when no user logged in" do
    agent = create(:agent)
    user = create(:user, agent: agent)
    delete :destroy, id: user.id
    assert_redirected_to new_session_path
  end

  test "destroy raises exception when agent logged in" do
    agent = create(:agent)
    user = create(:user, agent: agent)
    @controller.sign_in(agent, agent.authentication_token)
    delete :destroy, id: user.id
    assert_redirected_to new_session_path
  end

  test "destroy redirects to users when admin logged" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    agent = create(:agent)
    user = create(:user, agent: agent)
    @controller.sign_in(admin, admin.authentication_token)
    delete :destroy, id: user.id
    assert_redirected_to admin_users_path
    refute User.where(id: user.id).exists?
  end
end
