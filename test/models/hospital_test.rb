require "test_helper"

class HospitalTest < ActiveSupport::TestCase
  setup do
    @hospital = build(:hospital)
  end

  test "saves successfully with valid attributes" do
    assert @hospital.save!
  end
end
