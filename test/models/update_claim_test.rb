require "test_helper"

class UpdateClaimTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
    @claim = create(:claim, specialty: "internal_medicine", user: @user, status: "saved", number: nil)
  end

  test "performs properly with for_agent status" do
    assert_equal 1, @claim.number
    @claim.status = "for_agent"
    @claim.photo_id = create(:photo).id
    @claim.patient_name = "Alice James"
    @claim.hospital = "1681 QCH"
    @claim.diagnoses = [{name: "Flu"}]
    @claim.most_responsible_physician = true
    @claim.admission_on = 1.week.ago.to_date.to_s
    @claim.first_seen_on = 3.days.ago.to_date.to_s
    @claim.first_seen_consult = true
    @claim.last_seen_on = 1.day.ago.to_date.to_s
    @claim.last_seen_discharge = false
    @claim.icu_transfer = false
    @claim.consult_type = "comprehensive_er"
    @claim.consult_time_in = "17:00"
    @claim.consult_time_out = "20:00"
    @claim.consult_premium_visit = "holiday_day"
    @claim.consult_premium_first = true
    @claim.consult_premium_travel = true
    @claim.items = [build(:item, day: "2014-06-30", rows:[build(:row, code: "E082", fee: 1792)])]
    assert @claim.valid?
    assert @claim.no_warnings?
    @claim.save!
    assert_equal 1, @claim.number
  end
end
