require "test_helper"

class CreateClaimTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @interactor = CreateClaim.new(status: "saved", specialty: "internal_medicine")
    @interactor.user = @user
  end

  test "performs properly" do
    assert @interactor.perform
    assert @interactor.claim.persisted?
  end

  test "performs properly with for_agent status" do
    @interactor.status = "for_agent"
    @interactor.photo_id = create(:photo).id
    @interactor.patient_name = "Alice"
    @interactor.hospital = "Ottawa"
    @interactor.diagnoses = [{name: "Flu"}]
    @interactor.most_responsible_physician = true
    @interactor.admission_on = 1.week.ago.to_date.to_s
    @interactor.first_seen_on = 3.days.ago.to_date.to_s
    @interactor.first_seen_consult = true
    @interactor.last_seen_on = 1.day.ago.to_date.to_s
    @interactor.last_seen_discharge = false
    @interactor.icu_transfer = false
    @interactor.consult_type = "comprehensive_er"
    @interactor.consult_time_in = "17:00"
    @interactor.consult_time_out = "20:00"
    @interactor.consult_premium_visit = "holiday_day"
    @interactor.consult_premium_first = true
    @interactor.consult_premium_travel = true
    @interactor.daily_details = [{day: "2014-06-30", code: "E082", autogenerated: true}]
    @interactor.comment = "A comment"
    assert @interactor.perform
    assert @interactor.claim.persisted?
    assert_equal 1, @interactor.claim.number
    assert_equal 1, @interactor.claim.comments.count
    assert_equal "A comment", @interactor.claim.comments.first.body
  end

  test "is invalid with invalid photo_id" do
    @interactor.photo_id = "invalid"
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
    @interactor.status = "for_agent"
    @interactor.patient_name = nil
    assert_invalid @interactor, :patient_name
  end

  test "is invalid with invalid hospital" do
    @interactor.hospital = 0
    assert_invalid @interactor, :hospital
  end

  test "is invalid without hospital when submitted" do
    @interactor.status = "for_agent"
    @interactor.hospital = nil
    assert_invalid @interactor, :hospital
  end

  # test "is invalid without diagnoses when submitted" do
  #   @interactor.status = "for_agent"
  #   @interactor.diagnoses = []
  #   assert_invalid @interactor, :diagnoses
  # end

  test "is invalid with invalid referring_physician" do
    @interactor.referring_physician = 0
    assert_invalid @interactor, :referring_physician
  end

  test "is invalid with invalid most_responsible_physician" do
    @interactor.most_responsible_physician = "true"
    assert_invalid @interactor, :most_responsible_physician
  end

  test "is invalid without most_responsible_physician when submitted" do
    @interactor.status = "for_agent"
    @interactor.most_responsible_physician = nil
    assert_invalid @interactor, :most_responsible_physician
  end

  test "is invalid with invalid first_seen_on" do
    @interactor.first_seen_on = "01-01-2014"
    assert_invalid @interactor, :first_seen_on
  end

  test "is invalid without first_seen_on when submitted" do
    @interactor.status = "for_agent"
    @interactor.first_seen_on = nil
    assert_invalid @interactor, :first_seen_on
  end

  test "is invalid with invalid last_seen_on" do
    @interactor.last_seen_on = "01-01-2014"
    assert_invalid @interactor, :last_seen_on
  end

  test "is invalid without last_seen_on when submitted" do
    @interactor.status = "for_agent"
    @interactor.last_seen_on = nil
    assert_invalid @interactor, :last_seen_on
  end

  test "is invalid with invalid admission_on" do
    @interactor.admission_on = "01-01-2014"
    assert_invalid @interactor, :admission_on
  end

  test "is invalid without admission_on when submitted" do
    @interactor.status = "for_agent"
    @interactor.admission_on = nil
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

  test "is invalid without last_seen_discharge when submitted" do
    @interactor.status = "for_agent"
    @interactor.last_seen_discharge = nil
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

  test "is invalid with invalid daily_details autogenerated" do
    @interactor.daily_details = [{autogenerated: 1}]
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with invalid daily_details day" do
    @interactor.daily_details = [{day: "01-01-2014"}]
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with invalid daily_details code" do
    @interactor.daily_details = [{code: 1}]
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with daily_details without day when submitted" do
    @interactor.status = "for_agent"
    @interactor.daily_details = [{code: "A082", autogenerated: false}]
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with daily_details without code when submitted" do
    @interactor.status = "for_agent"
    @interactor.daily_details = [{day: "2014-02-01", autogenerated: false}]
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with daily_details without autogenerated when submitted" do
    @interactor.status = "for_agent"
    @interactor.daily_details = [{day: "2014-02-01", code: "A082"}]
    assert_invalid @interactor, :daily_details
  end

  test "is invalid with empty daily_details when submitted" do
    @interactor.status = "for_agent"
    @interactor.daily_details = []
    assert_invalid @interactor, :daily_details
  end

  test "orders daily details by day" do
    @interactor.daily_details = [{"day" => "2014-12-31"}, {"day" => "2014-12-01"}]
    @interactor.perform
    assert_equal({"day" => "2014-12-01"}, @interactor.claim.details["daily_details"].first)
    assert_equal({"day" => "2014-12-31"}, @interactor.claim.details["daily_details"].last)
  end
end
