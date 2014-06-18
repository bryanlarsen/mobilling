require "test_helper"

class CreateSessionTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @interactor = CreateSession.new(email: @user.email, password: @user.password)
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
