require "test_helper"

class Admin::DashboardsControllerTest < ActionController::TestCase
  test "show redirects to sign in when no user logged in" do
    get :show
    assert_redirected_to new_admin_session_path
  end

  test "show renders template when user logged in" do
    @controller.sign_in(create(:admin_user))
    get :show
    assert_template "show"
  end

  test "show assigns associated users when agent logged in" do
    agent = create(:admin_user, role: "agent")
    associated = create(:user, agent: agent)
    unassociated = create(:user)
    @controller.sign_in(agent)
    get :show
    assert assigns(:users).include?(associated)
    refute assigns(:users).include?(unassociated)
  end

  test "show sorts by saved count" do
    admin = create(:admin_user, role: "admin")
    alice = create(:user)
    create_list(:claim, 1, user: alice, status: "saved")
    bob = create(:user)
    create_list(:claim, 2, user: bob, status: "saved")
    @controller.sign_in(admin)
    get :show, sort: "saved_count", direction: "desc"
    assert_equal bob, assigns(:users).first
    assert_equal alice, assigns(:users).second
  end
end
