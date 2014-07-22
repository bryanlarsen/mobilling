require "test_helper"

class ClaimTest < ActiveSupport::TestCase
  setup do
    @claim = build(:claim)
  end

  test "saves successfully with valid attributes" do
    assert @claim.save!
  end

  test "submitted claim returns everything except saved claims" do
    saved_claim = create(:claim, :saved)
    unprocessed_claim = create(:claim, :unprocessed)
    processed_claim = create(:claim, :processed)
    rejected_admin_attention_claim = create(:claim, :rejected_admin_attention)
    rejected_doctor_attention_claim = create(:claim, :rejected_doctor_attention)
    paid_claim = create(:claim, :paid)

    refute Claim.submitted.include?(saved_claim)
    assert Claim.submitted.include?(unprocessed_claim)
    assert Claim.submitted.include?(processed_claim)
    assert Claim.submitted.include?(rejected_admin_attention_claim)
    assert Claim.submitted.include?(rejected_doctor_attention_claim)
    assert Claim.submitted.include?(paid_claim)
  end
end
