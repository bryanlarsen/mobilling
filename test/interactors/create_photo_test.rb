require "test_helper"

class CreatePhotoTest < ActiveSupport::TestCase
  setup do
    attributes = {
      user: create(:user),
      file: open(file_fixture("image.png"))
    }
    @interactor = CreatePhoto.new(attributes)
  end

  test "performs properly" do
    assert @interactor.perform
  end

  test "is invalid without file" do
    @interactor.file = nil
    @interactor.perform
    assert_invalid @interactor, :file
  end

  test "is invalid without user" do
    @interactor.user = nil
    @interactor.perform
    assert_invalid @interactor, :user
  end
end
