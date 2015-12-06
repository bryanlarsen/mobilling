require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @attributes = attributes_for(:user)
    @attributes[:agent_id] = create(:agent).id
  end

  test "saves successfully with valid attributes" do
    assert build(:user, @attributes).valid?
    assert build(:user, @attributes).save!
  end

  test "is invalid with already existing email" do
    create(:user, email: @attributes[:email])
    user = build(:user, @attributes)
    assert_invalid user, :email
  end

  test "is invalid with already existing email regardless case" do
    create(:user, email: @attributes[:email].upcase)
    user = build(:user, @attributes)
    assert_invalid user, :email
  end

  test "is invalid without password" do
    @attributes[:password] = ""
    user = build(:user, @attributes)
    assert_invalid user, :password
  end

  test "is invalid without agent" do
    @attributes[:agent_id] = nil
    user = build(:user, @attributes)
    assert_invalid user, :agent_id
    assert_invalid user, :agent
  end

  test "is invalid without name" do
    @attributes[:name] = ""
    user = build(:user, @attributes)
    assert_invalid user, :name
  end

  test "is invalid without email" do
    @attributes[:email] = ""
    user = build(:user, @attributes)
    assert_invalid user, :email
  end

  test "is invalid with invalid email" do
    @attributes[:email] = "invalid"
    user = build(:user, @attributes)
    assert_invalid user, :email
  end

  test "can create agent" do
    user = build(:user, attributes_for(:agent))
    assert user.valid?
    assert user.save!
  end

  class SavedUserTest < ActiveSupport::TestCase
    setup do
      user = create(:user, @attributes)
      @user = User.find(user.id)  # reload to clear password attributes
    end

    test "can update password" do
      assert @user.update!(password: "newpassword", password_confirmation: "newpassword", current_password: "password")
    end

    test "requires current password" do
      @user.assign_attributes(password: "newpassword2")
      assert_invalid @user, :current_password
    end

    test "requires password confirmation" do
      @user.assign_attributes(password: "newpassword3", password_confirmation: "newpassword7", current_password: "password")
      assert_invalid @user, :password_confirmation
    end
  end

end
