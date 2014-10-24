require "test_helper"

class Admin::UpdateClaimTest < ActiveSupport::TestCase
  include ActionMailer::TestHelper

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
      status: "for_agent",
      comment: "Comment"
    }
    @claim = create(:claim, old_attributes)
    @admin_user = create(:admin_user)
    @interactor = Admin::UpdateClaim.new(@claim, @admin_user, new_attributes)
  end

  test "performs properly" do
    assert @interactor.perform
    assert_equal @interactor.patient_name, @interactor.claim.details["patient_name"]
    assert_equal "OldHospital", @interactor.claim.details["hospital"]
    assert_equal 1, @interactor.claim.comments.count
    assert_equal "Comment", @interactor.claim.comments.first.body
  end

  test "sends no email when rejected_admin_attention" do
    @interactor.status = "agent_attention"
    assert_no_emails { @interactor.perform }
  end

  test "sends an email when rejected_doctor_attention" do
    @interactor.status = "doctor_attention"
    assert_emails(1) { @interactor.perform }
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
