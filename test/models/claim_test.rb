require "test_helper"

class ClaimTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
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

  test "a saved claim result in saved_claim_count being incremented" do
    saved_claim = create(:claim, :saved)
    assert @user.saved_count == 0
    @user.claims.push(saved_claim)
    assert @user.saved_count == 1
  end

  test "a unprocessed claim result in unprocessed_claim_count being incremented" do
    unprocessed_claim = create(:claim, :unprocessed)
    assert @user.unprocessed_count == 0
    @user.claims.push(unprocessed_claim)
    assert @user.unprocessed_count == 1
  end

  test "a processed claim result in processed_claim_count being incremented" do
    processed_claim = create(:claim, :processed)
    assert @user.processed_count == 0
    @user.claims.push(processed_claim)
    assert @user.processed_count == 1
  end

  test "a rejected_admin_attention claim result in rejected_admin_attention_claim_count being incremented" do
    rejected_admin_attention_claim = create(:claim, :rejected_admin_attention)
    assert @user.rejected_admin_attention_count == 0
    @user.claims.push(rejected_admin_attention_claim)
    assert @user.rejected_admin_attention_count == 1
  end

  test "a rejected_doctor_attention claim result in rejected_doctor_attention_claim_count being incremented" do
    rejected_doctor_attention_claim = create(:claim, :rejected_doctor_attention)
    assert @user.rejected_doctor_attention_count == 0
    @user.claims.push(rejected_doctor_attention_claim)
    assert @user.rejected_doctor_attention_count == 1
  end

  test "a paid claim result in paid_claim_count being incremented" do
    paid_claim = create(:claim, :paid)
    assert @user.paid_count == 0
    @user.claims.push(paid_claim)
    assert @user.paid_count == 1
  end
end
