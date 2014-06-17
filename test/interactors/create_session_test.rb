require "test_helper"

class CreateSessionTest < ActiveSupport::TestCase
  setup do
    @email = "user@example.com"
    @password = "secret"
    @user = create(:user, email: @email, password: @password)
    @interactor = CreateSession.new(email: @email, password: @password)
  end

  test "performs properly updating authentication_token" do
    assert @user.authentication_token.blank?
    assert @interactor.perform
    assert @user.reload.authentication_token.present?
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
