require "test_helper"

class Admin::CreateAdminUserTest < ActiveSupport::TestCase
  setup do
    attributes = {
      name: "Alice",
      email: "alice@example.com",
      password: "secret",
      password_confirmation: "secret",
      role: "admin"
    }
    @interactor = Admin::CreateAdminUser.new(attributes)
  end

  test "performs properly with valid attributes" do
    assert @interactor.perform
  end

  test "is invalid without password" do
    @interactor.password = ""
    @interactor.perform
    assert_invalid @interactor, :password
  end

  test "is invalid without password confirmation" do
    @interactor.password_confirmation = ""
    @interactor.perform
    assert_invalid @interactor, :password_confirmation
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
