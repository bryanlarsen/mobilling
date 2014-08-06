require "test_helper"

class Admin::SessionsControllerTest < ActionController::TestCase
  test "new renders template" do
    get :new
    assert_template "new"
  end

  test "create redirects to admin root" do
    create(:admin_user, email: "alice@example.com", password: "secret")
    post :create, admin_create_session: {email: "alice@example.com", password: "secret"}
    assert_redirected_to admin_root_path
    assert @controller.current_user_id.present?
  end

  test "create renders edit when invalid params given" do
    post :create, admin_create_session: {email: "invalid@email.com", password: "invalid"}
    assert_template "new"
    assert @controller.current_user_id.blank?
  end

  test "destroy redirects to sign in when no admin logged in" do
    delete :destroy
    assert_redirected_to new_admin_session_path
  end

  test "destroy redirects to root" do
    admin = create(:admin_user)
    @controller.sign_in(admin)
    delete :destroy
    assert_redirected_to admin_root_path
    assert @controller.current_user_id.blank?
  end
end
