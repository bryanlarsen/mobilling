require "test_helper"

class CreatePasswordTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  setup do
    @user = create(:user, password: "secret")
    @interactor = CreatePassword.new(token: generate_token(Time.now.to_i, @user.password_digest))
  end

  def generate_token(created_at, password_digest)
    message_verifier = Rails.application.message_verifier("password reset salt")
    Base64.urlsafe_encode64(message_verifier.generate([created_at, password_digest]))
  end

  test "performs properly" do
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
    @interactor.token = generate_token(2.days.ago.to_i, @user.password_digest)
    @interactor.perform
    assert_invalid @interactor, :token
  end

  test "is invalid when user has changed password" do
    @user.update!(password: "changed")
    @interactor.perform
    assert_invalid @interactor, :token
  end
end
