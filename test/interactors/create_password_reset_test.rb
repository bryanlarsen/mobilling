require "test_helper"

class CreatePasswordResetTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

  setup do
    @user = create(:user)
    @interactor = CreatePasswordReset.new(email: @user.email)
  end

  test "performs properly" do
    assert @interactor.perform
  end

  test "sends email" do
    assert_emails(1) { @interactor.perform }
  end

  test "is invalid with non-existing email" do
    @interactor.email = "non-existing@example.com"
    @interactor.perform
    assert_invalid @interactor, :email
  end
end
