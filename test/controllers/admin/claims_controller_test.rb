require "test_helper"

class Admin::ClaimsControllerTest < ActionController::TestCase
  test "index redirects to sign in when no user logged in" do
    get :index
    assert_redirected_to new_admin_session_path
  end

  test "index renders template when admin logged in" do
    agent = create(:admin_user)
    @controller.sign_in(agent)
    get :index
    assert_template "index"
  end

  test "index assigns claims of owned doctors when agent logged in" do
    agent = create(:admin_user, role: "agent")
    doctor = create(:user, agent: agent)
    associated = create(:claim, user: doctor)
    unassociated = create(:claim)
    @controller.sign_in(agent)
    get :index
    assert assigns(:claims).include?(associated)
    refute assigns(:claims).include?(unassociated)
  end

  test "index filters by user_id" do
    admin = create(:admin_user, role: "admin")
    user = create(:user)
    associated = create(:claim, user: user)
    unassociated = create(:claim)
    @controller.sign_in(admin)
    get :index, user_id: associated.user_id
    assert_template "index"
    assert assigns(:claims).include?(associated)
    refute assigns(:claims).include?(unassociated)
  end

  test "index filters by state" do
    admin = create(:admin_user, role: "admin")
    saved_claim = create(:claim, status: "saved")
    unprocessed_claim = create(:claim, status: "unprocessed")
    paid_claim = create(:claim, status: "paid")
    @controller.sign_in(admin)
    get :index, status: Claim.statuses.values_at("saved", "unprocessed")
    assert_template "index"
    assert assigns(:claims).include?(unprocessed_claim)
    assert assigns(:claims).include?(saved_claim)
    refute assigns(:claims).include?(paid_claim)
  end

  test "index sorts by number" do
    admin = create(:admin_user, role: "admin")
    first_claim = create(:claim, number: 1)
    second_claim = create(:claim, number: 2)
    @controller.sign_in(admin)
    get :index, sort: "number", direction: "desc"
    assert_template "index"
    assert_equal [second_claim, first_claim], assigns(:claims)
  end

  test "index sorts by doctor" do
    admin = create(:admin_user, role: "admin")
    alice_claim = create(:claim, user: build(:user, name: "Alice"))
    bob_claim = create(:claim, user: build(:user, name: "Bob"))
    @controller.sign_in(admin)
    get :index, sort: "users.name", direction: "desc"
    assert_template "index"
    assert_equal [bob_claim, alice_claim], assigns(:claims)
  end

  test "edit redirects to sign in when no user logged in" do
    claim = create(:claim)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: claim.id }
  end

  test "edit redirects to sign in when agent logged in and unassociated claim given" do
    agent = create(:admin_user, role: "agent")
    claim = create(:claim)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { get :edit, id: claim.id }
  end

  test "edit renders template when admin logged in" do
    admin = create(:admin_user, role: "admin")
    claim = create(:claim)
    @controller.sign_in(admin)
    get :edit, id: claim.id
    assert_template "edit"
  end

  test "update redirects to sign in when no user logged in" do
    claim = create(:claim)
    assert_raises(ActiveRecord::RecordNotFound) { put :update, id: claim.id }
  end

  test "update redirects to sign in when agent logged in and unassociated claim given" do
    agent = create(:admin_user, role: "agent")
    claim = create(:claim)
    @controller.sign_in(agent)
    assert_raises(ActiveRecord::RecordNotFound) { put :update, id: claim.id }
  end

  test "update redirects to claims when admin logged in and valid params given" do
    admin = create(:admin_user, role: "admin")
    claim = create(:claim)
    @controller.sign_in(admin)
    put :update, id: claim.id, claim: {patient_name: "Alice"}
    assert_redirected_to admin_claims_path
  end

  test "update renders edit when admin logged in and invalid params given" do
    admin = create(:admin_user, role: "admin")
    claim = create(:claim)
    @controller.sign_in(admin)
    put :update, id: claim.id, claim: {status: ""}
    assert_template "edit"
  end
end
