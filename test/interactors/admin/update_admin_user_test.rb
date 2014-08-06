require "test_helper"

class Admin::UpdateAdminUserTest < ActiveSupport::TestCase
  setup do
    old_attributes = {
      name: "OldAlice",
      email: "oldalice@example.com",
      password: "oldsecret",
      password_confirmation: "oldsecret",
      role: "agent"
    }
    new_attributes = {
      name: "Alice",
      email: "alice@example.com",
      password: "secret",
      password_confirmation: "secret",
      role: "admin"
    }
    @admin_user = create(:admin_user, old_attributes)
    @interactor = Admin::UpdateAdminUser.new(@admin_user, new_attributes)
  end

  test "performs properly with valid attributes" do
    assert @interactor.perform
    assert_equal @interactor.admin_user.name, @interactor.name
    assert_equal @interactor.admin_user.email, @interactor.email
    assert_equal @interactor.admin_user.role, @interactor.role
    assert @interactor.admin_user.authenticate(@interactor.password)
  end

  test "is valid without password and password confirmation" do
    @interactor.password = ""
    @interactor.password_confirmation = ""
    assert @interactor.perform
    assert @interactor.admin_user.authenticate("oldsecret")
  end

  test "is invalid with invalid password confirmation" do
    @interactor.password_confirmation = "invalid"
    @interactor.perform
    assert_invalid @interactor, :password_confirmation
  end

  test "is invalid without name" do
    @interactor.name = ""
    @interactor.perform
    assert_invalid @interactor, :name
  end

  test "is invalid without email" do
    @interactor.email = ""
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "is invalid with invalid email" do
    @interactor.email = "invalid"
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "is invalid without role" do
    @interactor.role = nil
    @interactor.perform
    assert_invalid @interactor, :role
  end

  test "is invalid with invalid role" do
    @interactor.role = "invalid"
    @interactor.perform
    assert_invalid @interactor, :role
  end

  test "is invalid with already existing email" do
    create(:admin_user, email: @interactor.email)
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "is invalid with already existing email regardless case" do
    create(:admin_user, email: "alice@example.com")
    @interactor.email = "Alice@example.com"
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "downcases email" do
    @interactor.email = "Alice@example.com"
    @interactor.perform
    assert_equal "alice@example.com", @interactor.admin_user.email
  end
end
