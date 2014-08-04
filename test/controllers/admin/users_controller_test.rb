require "test_helper"

class Admin::UsersControllerTest < ActionController::TestCase
  # test "index raises exception when no user logged in" do
  #   assert_raises(CanCan::AccessDenied) { get :index }
  # end

  # test "index raises exception when doctor logged in" do
  #   @controller.sign_in(create(:doctor))
  #   assert_raises(CanCan::AccessDenied) { get :index }
  # end

  # test "index assigns associated doctors when agent logged in" do
  #   user = create(:agent)
  #   associated = create(:doctor, agent: user)
  #   unassociated = create(:doctor)
  #   @controller.sign_in(user)
  #   get :index
  #   assert assigns(:users).include?(associated)
  #   refute assigns(:users).include?(unassociated)
  # end

  # test "index filters by agent_id" do
  #   user = create(:agent)
  #   associated = create(:doctor, agent: user)
  #   unassociated = create(:doctor)
  #   @controller.sign_in(user)
  #   get :index, agent_id: user.id
  #   assert assigns(:users).include?(associated)
  #   refute assigns(:users).include?(unassociated)
  # end

  # test "index renders template when admin logged in" do
  #   @controller.sign_in(create(:admin))
  #   get :index
  #   assert_template "index"
  # end

  # test "new raises exception when no user logged in" do
  #   assert_raises(CanCan::AccessDenied) { get :new }
  # end

  # test "new raises exception when doctor logged in" do
  #   @controller.sign_in(create(:doctor))
  #   assert_raises(CanCan::AccessDenied) { get :new }
  # end

  # test "new renders template when admin logged in" do
  #   @controller.sign_in(create(:admin))
  #   get :new
  #   assert_template "new"
  # end

  # test "create raises exception when no user logged in" do
  #   assert_raises(CanCan::AccessDenied) { post :create, user: attributes_for(:user) }
  # end

  # test "create raises exception when doctor logged in" do
  #   @controller.sign_in(create(:doctor))
  #   assert_raises(CanCan::AccessDenied) { post :create, user: attributes_for(:user) }
  # end

  # test "create redirects to users when admin logged in and valid params given" do
  #   @controller.sign_in(create(:admin))
  #   post :create, user: attributes_for(:user)
  #   assert_redirected_to admin_users_path
  # end

  # test "create renders edit when admin logged in and invalid params given" do
  #   @controller.sign_in(create(:admin))
  #   post :create, user: {plan: "non-existing"}
  #   assert_template "new"
  # end

  # test "edit raises exception when no user logged in" do
  #   user = create(:user)
  #   assert_raises(CanCan::AccessDenied) { get :edit, id: user.id }
  # end

  # test "edit raises exception when doctor logged in" do
  #   user = create(:user)
  #   @controller.sign_in(create(:doctor))
  #   assert_raises(CanCan::AccessDenied) { get :edit, id: user.id }
  # end

  # test "edit renders template when admin logged in" do
  #   user = create(:user)
  #   @controller.sign_in(create(:admin))
  #   get :edit, id: user.id
  #   assert_template "edit"
  # end

  # test "update raises exception when no user logged in" do
  #   user = create(:user)
  #   assert_raises(CanCan::AccessDenied) { put :update, id: user.id, user: attributes_for(:user) }
  # end

  # test "update raises exception when doctor logged in" do
  #   user = create(:user)
  #   @controller.sign_in(create(:doctor))
  #   assert_raises(CanCan::AccessDenied) { put :update, id: user.id, user: attributes_for(:user) }
  # end

  # test "update redirects to users when admin logged in and valid params given" do
  #   user = create(:user)
  #   @controller.sign_in(create(:admin))
  #   put :update, id: user.id, user: attributes_for(:user)
  #   assert_redirected_to admin_users_path
  # end

  # test "update renders edit when admin logged in and invalid params given" do
  #   user = create(:user)
  #   @controller.sign_in(create(:admin))
  #   put :update, id: user.id, user: {plan: "non-existing"}
  #   assert_template "edit"
  # end

  # test "destroy raises exception when no user logged in" do
  #   user = create(:user)
  #   assert_raises(CanCan::AccessDenied) { delete :destroy, id: user.id }
  # end

  # test "destroy raises exception when doctor logged in" do
  #   user = create(:user)
  #   @controller.sign_in(create(:doctor))
  #   assert_raises(CanCan::AccessDenied) { delete :destroy, id: user.id }
  # end

  # test "destroy redirects to users when admin logged" do
  #   user = create(:user)
  #   @controller.sign_in(create(:admin))
  #   delete :destroy, id: user.id
  #   assert_redirected_to admin_users_path
  #   refute User.where(id: user.id).exists?
  # end
end
