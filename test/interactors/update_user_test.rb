require "test_helper"

class UpdateUserTest < ActiveSupport::TestCase
  setup do
    @interactor = UpdateUser.new(user: create(:user))
  end

  test "is invalid without a name" do
    @interactor.email = Faker::Internet.email
    @interactor.perform
    assert_invalid @interactor, :name
  end

  test "is invalid without an email" do
    @interactor.name = Faker::Lorem.word
    @interactor.perform
    assert_invalid @interactor, :email
  end

  test "is invalid without a user" do
    @interactor.name = Faker::Lorem.word
    @interactor.email = Faker::Internet.email
    @interactor.user = nil
    @interactor.perform
    assert_invalid @interactor, :user
  end
end
