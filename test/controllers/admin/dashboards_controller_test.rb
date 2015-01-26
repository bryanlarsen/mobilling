require "test_helper"

class Admin::DashboardsControllerTest < ActionController::TestCase
  test "show redirects to sign in when no user logged in" do
    get :show
    assert_redirected_to new_session_path
  end

  test "show renders template when user logged in" do
    agent = create(:agent)
    @controller.sign_in(agent, agent.authentication_token)
    get :show
    assert_template "show"
  end

  test "show assigns associated users when agent logged in" do
    agent = create(:agent)
    agent2 = create(:agent)
    associated = create(:user, agent: agent)
    unassociated = create(:user, agent: agent2)
    @controller.sign_in(agent, agent.authentication_token)
    get :show
    assert assigns(:users).include?(associated)
    refute assigns(:users).include?(unassociated)
  end

  test "show sorts by saved count" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    alice = create(:user)
    create_list(:claim, 1, user: alice, status: "saved")
    bob = create(:user)
    create_list(:claim, 2, user: bob, status: "saved")
    @controller.sign_in(admin, admin.authentication_token)
    get :show, sort: "saved_count", direction: "desc"
    assert_equal bob, assigns(:users).first
    assert_equal alice, assigns(:users).second
  end
end
