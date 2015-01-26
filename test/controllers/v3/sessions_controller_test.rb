require "test_helper"

class V3::SessionsControllerTest < ActionController::TestCase
  test "new renders template" do
    get :new
    assert_template "new"
  end

  test "create redirects to root" do
    create(:user, email: "alice@example.com", password: "secret")
    post :create, v3_create_session: {email: "alice@example.com", password: "secret"}
    assert_redirected_to root_path
    assert @controller.current_user.present?
  end

  test "create renders edit when invalid params given" do
    post :create, v3_create_session: {email: "invalid@email.com", password: "invalid"}
    assert_template "new"
    assert @controller.current_user.blank?
  end

  test "destroy redirects to sign in when no admin logged in" do
    delete :destroy
    assert_redirected_to new_session_path
  end

  test "destroy redirects to root" do
    admin = create(:user)
    @controller.sign_in(admin, admin.authentication_token)
    delete :destroy
    assert_redirected_to new_session_path
    assert @controller.current_user.blank?
  end
end
