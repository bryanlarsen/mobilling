require "test_helper"

class Admin::CreateSessionTest < ActiveSupport::TestCase
  setup do
    attributes = {
      email: "alice@example.com",
      password: "secret"
    }
    @user = create(:admin_user, attributes)
    @interactor = Admin::CreateSession.new(attributes)
  end

  test "performs properly" do
    assert @interactor.perform
  end

  test "is invalid with non-existing email" do
    @interactor.email = "non-existing@example.com"
    @interactor.perform
    assert_invalid @interactor, :password
  end

  test "is invalid with invalid password" do
    @interactor.password = "invalid-secret"
    @interactor.perform
    assert_invalid @interactor, :password
  end
end
