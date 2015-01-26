require "test_helper"

class Admin::UsersControllerTest < ActionController::TestCase
  test "index redirects to sign in when no user logged in" do
    get :index
    assert_redirected_to new_session_path
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
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: user.id }
  end

  test "edit raises exception when unassociated user" do
    agent = create(:agent)
    agent2 = create(:agent)
    user = create(:user, agent: agent2)
    @controller.sign_in(agent, agent.authentication_token)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: user.id }
  end

  test "edit renders template when admin logged in" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    user = create(:user)
    @controller.sign_in(admin, admin.authentication_token)
    get :edit, id: user.id
    assert_template "edit"
  end

  # omit "update raises exception when no user logged in" do
  #   user = create(:user)
  #   assert_raises(ActiveRecord::RecordNotFound) { put :update, id: user.id }
  # end

  # omit "update raises exception when unassociated user" do
  #   agent = create(:agent)
  #   agent2 = create(:agent)
  #   user = create(:user, agent: agent2)
  #   @controller.sign_in(agent, agent.authentication_token)
  #   assert_raises(ActiveRecord::RecordNotFound) { put :update, id: user.id }
  # end

  # omit "update redirects to users when admin logged in and valid params given" do
  #   admin = build(:agent, role: "admin")
  #   admin.save(validate: false)
  #   agent = create(:agent)
  #   user = create(:user, agent: agent)
  #   @controller.sign_in(admin, admin.authentication_token)
  #   put :update, id: user.id, update_user: attributes_for(:user)
  #   assert_redirected_to admin_users_path
  # end

  # omit "update renders edit when admin logged in and invalid params given" do
  #   admin = build(:agent, role: "admin")
  #   admin.save(validate: false)
  #   agent = create(:agent)
  #   user = create(:user, agent: agent)
  #   @controller.sign_in(admin, admin.authentication_token)
  #   put :update, id: user.id, update_user: {name: ""}
  #   assert_template "edit"
  # end

  test "destroy raises exception when no user logged in" do
    agent = create(:agent)
    user = create(:user, agent: agent)
    assert_raises(ActiveRecord::RecordNotFound) { delete :destroy, id: user.id }
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
