require "test_helper"

class UpdateUserTest < ActiveSupport::TestCase
  setup do
    old_attributes = {
      name: "OldAlice",
      email: "oldalice@example.com",
      password: "oldsecret",
      agent_id: create(:admin_user, role: "agent").id
    }
    new_attributes = {
      name: "Alice",
      email: "alice@example.com",
      password: "secret",
      agent_id: create(:admin_user, role: "agent").id
    }
    @user = create(:user, old_attributes)
    @interactor = UpdateUser.new(@user, new_attributes)
  end

  test "performs properly" do
    assert @interactor.perform
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

  test "is invalid without name" do
    @interactor.name = ""
    @interactor.perform
    assert_invalid @interactor, :name
  end

  test "is invalid without agent_id" do
    @interactor.agent_id = nil
    @interactor.perform
    assert_invalid @interactor, :agent_id
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

  test "updates password" do
    @interactor.password = "newsecret"
    @interactor.perform
    assert @interactor.user.authenticate("newsecret")
  end

  test "does not update password if not given" do
    @interactor.password = ""
    @interactor.perform
    assert @interactor.user.authenticate("oldsecret")
  end
end
