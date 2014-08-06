require "test_helper"

class CreateUserTest < ActiveSupport::TestCase
  setup do
    attributes = {
      name: "Alice",
      email: "alice@example.com",
      password: "secret",
      agent_id: create(:admin_user, role: "agent").id
    }
    @interactor = CreateUser.new(attributes)
  end

  test "performs properly updating authentication_token" do
    assert @interactor.perform
    assert @interactor.user.authentication_token.present?
  end

  test "is invalid with already existing email" do
    create(:user, email: @interactor.email)
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "is invalid with already existing email regardless case" do
    create(:user, email: @interactor.email)
    @interactor.email = @interactor.email.upcase
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "is invalid without password" do
    @interactor.password = ""
    @interactor.perform
    assert_invalid @interactor, :password
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

  test "downcases email" do
    @interactor.email = "Alice@example.com"
    @interactor.perform
    assert_equal "alice@example.com", @interactor.user.email
  end
end
