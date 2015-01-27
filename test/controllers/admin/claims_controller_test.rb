require "test_helper"

class Admin::ClaimsControllerTest < ActionController::TestCase
  test "index redirects to sign in when no user logged in" do
    get :index
    assert_redirected_to new_session_path
    assert session[:admin]
  end

  test "index renders template when admin logged in" do
    agent = create(:agent)
    @controller.sign_in(agent, agent.authentication_token)
    get :index
    assert_template "index"
  end

  test "index assigns claims of owned doctors when agent logged in" do
    agent = create(:agent)
    doctor = create(:user, agent: agent)
    @controller.sign_in(agent, agent.authentication_token)
    associated = create(:claim, user: doctor)
    unassociated = create(:claim)
    get :index
    assert assigns(:claims).include?(associated)
    refute assigns(:claims).include?(unassociated)
  end

  test "index filters by user_id" do
    agent = create(:agent)
    doctor = create(:user, agent: agent)
    @controller.sign_in(agent, agent.authentication_token)
    associated = create(:claim, user: doctor)
    unassociated = create(:claim)
    get :index, user_id: associated.user_id
    assert_template "index"
    assert assigns(:claims).include?(associated)
    refute assigns(:claims).include?(unassociated)
  end

  test "index filters by state" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    saved_claim = create(:claim, status: "saved")
    unprocessed_claim = create(:claim, status: "for_agent")
    done_claim = create(:claim, status: "done")
    get :index, status: Claim.statuses.values_at("saved", "for_agent")
    assert_template "index"
    assert assigns(:claims).include?(unprocessed_claim)
    assert assigns(:claims).include?(saved_claim)
    refute assigns(:claims).include?(done_claim)
  end

  test "index sorts by number" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    first_claim = create(:claim, number: 1)
    second_claim = create(:claim, number: 2)
    get :index, sort: "number", direction: "desc"
    assert_template "index"
    assert_equal [second_claim, first_claim], assigns(:claims)
  end

  test "index sorts by number asc" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    first_claim = create(:claim, number: 1)
    second_claim = create(:claim, number: 2)
    get :index, sort: "number", direction: "asc"
    assert_template "index"
    assert_equal [first_claim, second_claim], assigns(:claims)
  end

  test "index sorts by doctor" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    alice_claim = create(:claim, user: build(:user, name: "Alice"))
    bob_claim = create(:claim, user: build(:user, name: "Bob"))
    get :index, sort: "users.name", direction: "desc"
    assert_template "index"
    assert_equal [bob_claim, alice_claim], assigns(:claims)
  end

  test "edit raises exception when no user logged in" do
    claim = create(:claim)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: claim.id }
  end

  test "edit raises exception when agent logged in and unassociated claim given" do
    agent = create(:agent)
    @controller.sign_in(agent, agent.authentication_token)
    claim = create(:claim)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: claim.id }
  end

  test "edit renders template when admin logged in" do
    admin = build(:agent, role: "admin")
    admin.save(validate: false)
    @controller.sign_in(admin, admin.authentication_token)
    claim = create(:claim)
    get :edit, id: claim.id
    assert_template "edit"
  end
end
