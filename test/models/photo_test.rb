require "test_helper"

class PhotoTest < ActiveSupport::TestCase
  setup do
    @photo = build(:photo)
  end

  test "saves successfully with valid attributes" do
    assert @photo.save!
  end
end
