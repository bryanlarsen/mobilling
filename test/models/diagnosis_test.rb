require "test_helper"

class DiagnosisTest < ActiveSupport::TestCase
  setup do
    @diagnosis = build(:diagnosis)
  end

  test "saves successfully with valid attributes" do
    assert @diagnosis.save!
  end
end
