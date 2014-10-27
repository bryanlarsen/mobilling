require "test_helper"

class ClaimTest < ActiveSupport::TestCase
  test "saves successfully with valid attributes" do
    @claim = build(:claim)
    assert @claim.save!
  end

  test "submitted claim returns everything except saved claims" do
    saved_claim = create(:claim, status: "saved")
    for_agent_claim = create(:claim, status: "for_agent")
    processed_claim = create(:claim, status: "file_created")
    rejected_claim = create(:claim, status: "agent_attention")
    rejected_doctor_attention_claim = create(:claim, status: "doctor_attention")
    done_claim = create(:claim, status: "done")

    refute Claim.submitted.include?(saved_claim)
    assert Claim.submitted.include?(for_agent_claim)
    assert Claim.submitted.include?(processed_claim)
    assert Claim.submitted.include?(rejected_claim)
    assert Claim.submitted.include?(rejected_doctor_attention_claim)
    assert Claim.submitted.include?(done_claim)
  end

  test "attributes aren't lost during round trip" do
    @claim = build(:claim, patient_number: 17, status: "saved", daily_details: [{code: "P018B", message: "foo"}])
    @interactor = UpdateClaim.new(@claim, daily_details: [{code: "P018B", fee: 10000}])
    assert @interactor.perform
    assert_equal @claim.details["patient_number"], 17
    # WARNING: take note of this:  all claim item attributes that are
    # not round-tripped *will* be lost
    # assert_equal @claim.details["daily_details"][0]["message"], "foo"
    assert_equal @claim.details["daily_details"][0]["fee"], 10000
  end

end
