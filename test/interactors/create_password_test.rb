require "test_helper"

class CreatePasswordTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  setup do
    @user = create(:user, password: "secret")
    @cpr_interactor = CreatePasswordReset.new(email: @user.email)
    @interactor = CreatePassword.new(token: generate_token(Time.now))
  end

  def generate_token(time)
    @cpr_interactor.perform(time)
    @cpr_interactor.token
  end

  test "000 performs properly" do
    assert @interactor.perform
  end

  test "sends email" do
    assert_emails(1) { @interactor.perform }
  end

  test "is invalid without token" do
    @interactor.token = nil
    @interactor.perform
    assert_invalid @interactor, :token
  end

  test "is invalid with empty token" do
    @interactor.token = ""
    @interactor.perform
    assert_invalid @interactor, :token
  end

  test "is invalid with invalid token" do
    @interactor.token = "invalidinvalid"
    @interactor.perform
    assert_invalid @interactor, :token
  end

  test "is invalid with expired token" do
    @interactor.token = generate_token(2.days.ago)
    @interactor.perform
    assert_invalid @interactor, :token
  end

  test "is invalid when user has changed password" do
    assert @user.update!(password: "changed", password_confirmation: "changed", current_password: "secret")
    @interactor.perform
    assert_invalid @interactor, :token
  end
end
