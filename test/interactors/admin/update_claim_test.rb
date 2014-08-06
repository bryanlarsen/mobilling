require "test_helper"

class Admin::UpdateClaimTest < ActiveSupport::TestCase
  setup do
    old_attributes = {
      details: {
        patient_name: "OldAlice",
        hospital: "OldHospital"
      },
      status: "saved"
    }
    new_attributes = {
      patient_name: "Alice",
      status: "unprocessed"
    }
    @claim = create(:claim, old_attributes)
    @interactor = Admin::UpdateClaim.new(@claim, new_attributes)
  end

  test "performs properly" do
    assert @interactor.perform
    assert_equal @interactor.patient_name, @interactor.claim.details["patient_name"]
    assert_equal "OldHospital", @interactor.claim.details["hospital"]
  end

  test "is invalid without status" do
    @interactor.status = ""
    assert_invalid @interactor, :status
  end

  test "is invalid with invalid status" do
    @interactor.status = "invalid"
    assert_invalid @interactor, :status
  end
end
