require "test_helper"

class UpdateClaimTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @interactor = UpdateClaim.new(id: SecureRandom.uuid, user: @user, status: "saved", daily_details: [])
  end

  test "performs properly updating authentication_token" do
    assert @interactor.perform
    assert @interactor.claim.persisted?
  end

  test "is invalid with invalid photo_id" do
    @interactor.photo_id = "invalid"
    assert_invalid @interactor, :photo_id
  end

  test "is invalid without photo_id when submitted" do
    @interactor.status = "unprocessed"
    @interactor.photo_id = nil
    assert_invalid @interactor, :photo_id
  end

  test "is invalid with invalid status" do
    @interactor.status = "invalid"
    assert_invalid @interactor, :status
  end

  test "is invalid with invalid patient_name" do
    @interactor.patient_name = 0
    assert_invalid @interactor, :patient_name
  end

  test "is invalid without patient_name when submitted" do
    @interactor.status = "unprocessed"
    @interactor.patient_name = nil
    assert_invalid @interactor, :patient_name
  end

  test "is invalid with invalid hospital" do
    @interactor.hospital = 0
    assert_invalid @interactor, :hospital
  end

  test "is invalid without hospital when submitted" do
    @interactor.status = "unprocessed"
    @interactor.hospital = nil
    assert_invalid @interactor, :hospital
  end

  test "is invalid with invalid diagnosis" do
    @interactor.diagnosis = 0
    assert_invalid @interactor, :diagnosis
  end

  test "is invalid without diagnosis when submitted" do
    @interactor.status = "unprocessed"
    @interactor.diagnosis = nil
    assert_invalid @interactor, :diagnosis
  end

  test "is invalid with invalid referring_physician" do
    @interactor.referring_physician = 0
    assert_invalid @interactor, :referring_physician
  end

  test "is invalid without referring_physician when submitted" do
    @interactor.status = "unprocessed"
    @interactor.referring_physician = nil
    assert_invalid @interactor, :referring_physician
  end

  test "is invalid with invalid most_responsible_physician" do
    @interactor.most_responsible_physician = "true"
    assert_invalid @interactor, :most_responsible_physician
  end

  test "is invalid without most_responsible_physician when submitted" do
    @interactor.status = "unprocessed"
    @interactor.most_responsible_physician = nil
    assert_invalid @interactor, :most_responsible_physician
  end

  test "is invalid with invalid first_seen_on" do
    @interactor.first_seen_on = "01-01-2014"
    assert_invalid @interactor, :first_seen_on
  end

  test "is invalid without first_seen_on when submitted" do
    @interactor.status = "unprocessed"
    @interactor.first_seen_on = nil
    assert_invalid @interactor, :first_seen_on
  end

  test "is invalid with invalid last_seen_on" do
    @interactor.last_seen_on = "01-01-2014"
    assert_invalid @interactor, :last_seen_on
  end

  test "is invalid without last_seen_on when submitted" do
    @interactor.status = "unprocessed"
    @interactor.last_seen_on = nil
    assert_invalid @interactor, :last_seen_on
  end

  test "is invalid with invalid admission_on" do
    @interactor.admission_on = "01-01-2014"
    assert_invalid @interactor, :admission_on
  end

  test "is invalid without admission_on when submitted" do
    @interactor.status = "unprocessed"
    @interactor.admission_on = nil
    assert_invalid @interactor, :admission_on
  end

  test "is invalid with invalid first_seen_consult" do
    @interactor.first_seen_consult = "true"
    assert_invalid @interactor, :first_seen_consult
  end

  test "is invalid without first_seen_consult when submitted" do
    @interactor.status = "unprocessed"
    @interactor.first_seen_consult = nil
    assert_invalid @interactor, :first_seen_consult
  end

  test "is invalid with invalid last_seen_discharge" do
    @interactor.last_seen_discharge = "true"
    assert_invalid @interactor, :last_seen_discharge
  end

  test "is invalid without last_seen_discharge when submitted" do
    @interactor.status = "unprocessed"
    @interactor.last_seen_discharge = nil
    assert_invalid @interactor, :last_seen_discharge
  end

  test "is invalid with invalid icu_transfer" do
    @interactor.icu_transfer = "true"
    assert_invalid @interactor, :icu_transfer
  end

  test "is invalid with icu_transfer when first seen is admission" do
    @interactor.first_seen_on = Date.today.to_s
    @interactor.admission_on = Date.today.to_s
    @interactor.icu_transfer = false
    assert_invalid @interactor, :icu_transfer
  end

  test "is invalid with icu_transfer when not most responsible physician" do
    @interactor.first_seen_on = Date.today.to_s
    @interactor.admission_on = Date.yesterday.to_s
    @interactor.most_responsible_physician = false
    @interactor.icu_transfer = false
    assert_invalid @interactor, :icu_transfer
  end

  test "is invalid without icu_transfer when first seen is not admission and most responsible physician" do
    @interactor.first_seen_on = Date.today.to_s
    @interactor.admission_on = Date.yesterday.to_s
    @interactor.most_responsible_physician = true
    @interactor.icu_transfer = nil
    assert_invalid @interactor, :icu_transfer
  end

  test "is invalid with invalid consult_type" do
    @interactor.consult_type = "invalid"
    assert_invalid @interactor, :consult_type
  end

  test "is invalid with consult_type when no consult" do
    @interactor.first_seen_on = Date.today.to_s
    @interactor.admission_on = Date.today.to_s
    @interactor.first_seen_consult = false
    @interactor.consult_type = "general_er"
    assert_invalid @interactor, :consult_type
  end

  test "is invalid without consult_type when consult" do
    @interactor.first_seen_on = Date.today.to_s
    @interactor.admission_on = Date.today.to_s
    @interactor.first_seen_consult = true
    @interactor.consult_type = nil
    assert_invalid @interactor, :consult_type
  end

  test "is invalid with invalid consult_premium_visit" do
    @interactor.consult_premium_visit = "invalid"
    assert_invalid @interactor, :consult_premium_visit
  end

  test "is invalid with invalid consult_time_in" do
    @interactor.consult_time_in = "5am"
    assert_invalid @interactor, :consult_time_in
  end

  test "is invalid with consult_time_in when no consult" do
    @interactor.consult_time_in = "17:00"
    assert_invalid @interactor, :consult_time_in
  end

  test "is invalid without consult_time_in when consult" do
    @interactor.consult_type = "comprehensive_er"
    @interactor.consult_time_in = nil
    assert_invalid @interactor, :consult_time_in
  end

  test "is invalid with invalid consult_time_out" do
    @interactor.consult_time_out = "5am"
    assert_invalid @interactor, :consult_time_out
  end

  test "is invalid with consult_time_out when no consult" do
    @interactor.consult_time_out = "17:00"
    assert_invalid @interactor, :consult_time_out
  end

  test "is invalid without consult_time_out when consult" do
    @interactor.consult_type = "comprehensive_er"
    @interactor.consult_time_out = nil
    assert_invalid @interactor, :consult_time_out
  end

  test "is invalid with invalid consult_premium_travel" do
    @interactor.consult_premium_travel = "true"
    assert_invalid @interactor, :consult_premium_travel
  end

  test "is invalid without daily_details" do
    @interactor.daily_details = nil
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with invalid type daily_details" do
    @interactor.daily_details = {}
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with invalid daily_details 1" do
    @interactor.daily_details = [{autogenerated: 1}]
    assert_invalid @interactor, :daily_details
  end
end
