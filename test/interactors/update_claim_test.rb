require "test_helper"

class UpdateClaimTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @interactor = UpdateClaim.new(id: SecureRandom.uuid, user: @user)
  end

  test "performs properly updating authentication_token" do
    assert @interactor.perform
    assert @interactor.claim.persisted?
  end

  test "is invalid with invalid photo_id" do
    @interactor.photo_id = "invalid"
    assert_invalid @interactor, :photo_id
  end

  test "is invalid with invalid patient_name" do
    @interactor.patient_name = 0
    assert_invalid @interactor, :patient_name
  end

  test "is invalid with invalid hospital" do
    @interactor.hospital = 0
    assert_invalid @interactor, :hospital
  end

  test "is invalid with invalid diagnosis" do
    @interactor.diagnosis = 0
    assert_invalid @interactor, :diagnosis
  end

  test "is invalid with invalid referring_physician" do
    @interactor.referring_physician = 0
    assert_invalid @interactor, :referring_physician
  end

  test "is invalid with invalid most_responsible_physician" do
    @interactor.most_responsible_physician = "true"
    assert_invalid @interactor, :most_responsible_physician
  end

  test "is invalid with invalid first_seen_on" do
    @interactor.first_seen_on = "01-01-2014"
    assert_invalid @interactor, :first_seen_on
  end

  test "is invalid with invalid last_seen_on" do
    @interactor.last_seen_on = "01-01-2014"
    assert_invalid @interactor, :last_seen_on
  end

  test "is invalid with invalid admission_on" do
    @interactor.admission_on = "01-01-2014"
    assert_invalid @interactor, :admission_on
  end

  test "is invalid with invalid first_seen_consult" do
    @interactor.first_seen_consult = "true"
    assert_invalid @interactor, :first_seen_consult
  end

  test "is invalid with invalid last_seen_discharge" do
    @interactor.last_seen_discharge = "true"
    assert_invalid @interactor, :last_seen_discharge
  end

  test "is invalid with invalid icu_transfer" do
    @interactor.icu_transfer = "true"
    assert_invalid @interactor, :icu_transfer
  end

  test "is invalid with invalid consult_type" do
    @interactor.consult_type = "invalid"
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

  test "is invalid with invalid consult_time_out" do
    @interactor.consult_time_out = "5am"
    assert_invalid @interactor, :consult_time_out
  end

  test "is invalid with invalid consult_premium_travel" do
    @interactor.consult_premium_travel = "true"
    assert_invalid @interactor, :consult_premium_travel
  end
end
