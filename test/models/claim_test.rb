require "test_helper"

class ClaimTest < ActiveSupport::TestCase
  setup do
    @claim = build(:claim)
  end

  test "saves successfully with valid attributes" do
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
end
