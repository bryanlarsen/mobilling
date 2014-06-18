require "test_helper"

class CreateUserTest < ActiveSupport::TestCase
  setup do
    @interactor = CreateUser.new(attributes_for(:user))
  end

  test "performs properly updating authentication_token" do
    assert @interactor.perform
    assert @interactor.user.authentication_token.present?
  end

  test "is invalid with non-existing email" do
    create(:user, email: @interactor.email)
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
end
