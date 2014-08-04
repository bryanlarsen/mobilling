require "test_helper"

class Admin::UsersControllerTest < ActionController::TestCase
  test "index redirects to sign in when no user logged in" do
    get :index
    assert_redirected_to new_admin_session_path
  end

  test "index renders template when admin logged in" do
    admin = create(:admin_user, role: "admin")
    @controller.sign_in(admin)
    get :index
    assert_template "index"
  end

  test "index assigns associated doctors when agent logged in" do
    agent = create(:admin_user, role: "agent")
    associated = create(:user, agent: agent)
    unassociated = create(:user)
    @controller.sign_in(agent)
    get :index
    assert assigns(:users).include?(associated)
    refute assigns(:users).include?(unassociated)
  end

  test "index filters by agent_id" do
    admin = create(:admin_user, role: "admin")
    agent = create(:admin_user, role: "agent")
    associated = create(:user, agent: agent)
    unassociated = create(:user)
    @controller.sign_in(admin)
    get :index, agent_id: agent.id
    assert assigns(:users).include?(associated)
    refute assigns(:users).include?(unassociated)
  end

  test "edit raises exception when no user logged in" do
    user = create(:user)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: user.id }
  end

  test "edit raises exception when unassociated user" do
    agent = create(:admin_user, role: "agent")
    user = create(:user)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: user.id }
  end

  test "edit renders template when admin logged in" do
    admin = create(:admin_user, role: "admin")
    user = create(:user)
    @controller.sign_in(admin)
    get :edit, id: user.id
    assert_template "edit"
  end

  test "update raises exception when no user logged in" do
    user = create(:user)
    assert_raises(ActiveRecord::RecordNotFound) { put :update, id: user.id }
  end

  test "update raises exception when unassociated user" do
    agent = create(:admin_user, role: "agent")
    user = create(:user)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { put :update, id: user.id }
  end

  test "update redirects to users when admin logged in and valid params given" do
    admin = create(:admin_user, role: "admin")
    user = create(:user)
    @controller.sign_in(admin)
    put :update, id: user.id, admin_update_user: attributes_for(:user)
    assert_redirected_to admin_users_path
  end

  test "update renders edit when admin logged in and invalid params given" do
    admin = create(:admin_user, role: "admin")
    user = create(:user)
    @controller.sign_in(admin)
    put :update, id: user.id, admin_update_user: {name: ""}
    assert_template "edit"
  end

  test "destroy raises exception when no user logged in" do
    user = create(:user)
    assert_raises(ActiveRecord::RecordNotFound) { delete :destroy, id: user.id }
  end

  test "destroy raises exception when agent logged in" do
    agent = create(:admin_user, role: "agent")
    user = create(:user)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { delete :destroy, id: user.id }
  end

  test "destroy redirects to users when admin logged" do
    admin = create(:admin_user, role: "admin")
    user = create(:user)
    @controller.sign_in(admin)
    delete :destroy, id: user.id
    assert_redirected_to admin_users_path
    refute User.where(id: user.id).exists?
  end
end
