require "test_helper"

class Admin::AdminUsersControllerTest < ActionController::TestCase
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

  test "index assigns agent only when agent logged in" do
    agent = create(:admin_user, role: "agent")
    other = create(:admin_user)
    @controller.sign_in(agent)
    get :index
    assert assigns(:admin_users).include?(agent)
    refute assigns(:admin_users).include?(other)
  end

  test "new redirects to sign in when no user logged in" do
    get :new
    assert_redirected_to new_admin_session_path
  end

  test "new redirects to sign in when agent logged in" do
    agent = create(:admin_user, role: "agent")
    @controller.sign_in(agent)
    get :new
    assert_redirected_to new_admin_session_path
  end

  test "new renders template when admin logged in" do
    admin = create(:admin_user, role: "admin")
    @controller.sign_in(admin)
    get :new
    assert_template "new"
  end

  test "create redirects to sign in when no user logged in" do
    post :create, admin_create_admin_user: {name: "Alice"}
    assert_redirected_to new_admin_session_path
  end

  test "create redirects to sign in when agent logged in" do
    agent = create(:admin_user, role: "agent")
    @controller.sign_in(agent)
    post :create, admin_create_admin_user: {name: "Alice"}
    assert_redirected_to new_admin_session_path
  end

  test "create redirects to users when admin logged in and valid params given" do
    admin = create(:admin_user, role: "admin")
    @controller.sign_in(admin)
    post :create, admin_create_admin_user: {name: "Alice", email: "alice@example.com", password: "secret", password_confirmation: "secret", role: "admin"}
    assert_redirected_to admin_admin_users_path
  end

  test "create renders edit when admin logged in and invalid params given" do
    admin = create(:admin_user, role: "admin")
    @controller.sign_in(admin)
    post :create, admin_create_admin_user: {name: ""}
    assert_template "new"
  end

  test "edit raises exception when no user logged in" do
    admin_user = create(:admin_user)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: admin_user.id }
  end

  test "edit raises exception when unassociated user" do
    agent = create(:admin_user, role: "agent")
    admin_user = create(:admin_user)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: admin_user.id }
  end

  test "edit renders template when admin logged in" do
    admin = create(:admin_user, role: "admin")
    admin_user = create(:admin_user)
    @controller.sign_in(admin)
    get :edit, id: admin_user.id
    assert_template "edit"
  end

  test "update raises exception when no user logged in" do
    admin_user = create(:admin_user)
    assert_raises(ActiveRecord::RecordNotFound) { put :update, id: admin_user.id }
  end

  test "update raises exception when unassociated user" do
    agent = create(:admin_user, role: "agent")
    admin_user = create(:admin_user)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { put :update, id: admin_user.id }
  end

  test "update redirects to users when admin logged in and valid params given" do
    admin = create(:admin_user, role: "admin")
    admin_user = create(:admin_user)
    @controller.sign_in(admin)
    put :update, id: admin_user.id, admin_update_admin_user: attributes_for(:admin_user)
    assert_redirected_to admin_admin_users_path
  end

  test "update renders edit when admin logged in and invalid params given" do
    admin = create(:admin_user, role: "admin")
    admin_user = create(:admin_user)
    @controller.sign_in(admin)
    put :update, id: admin_user.id, admin_update_admin_user: {name: ""}
    assert_template "edit"
  end

  test "destroy raises exception when no user logged in" do
    admin_user = create(:admin_user)
    assert_raises(ActiveRecord::RecordNotFound) { delete :destroy, id: admin_user.id }
  end

  test "destroy raises exception when agent logged in" do
    agent = create(:admin_user, role: "agent")
    admin_user = create(:admin_user)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { delete :destroy, id: admin_user.id }
  end

  test "destroy redirects to users when admin logged" do
    admin = create(:admin_user, role: "admin")
    admin_user = create(:admin_user)
    @controller.sign_in(admin)
    delete :destroy, id: admin_user.id
    assert_redirected_to admin_admin_users_path
    refute Admin::User.where(id: admin_user.id).exists?
  end
end
