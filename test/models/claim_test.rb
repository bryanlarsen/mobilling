require "test_helper"

class ClaimTest < ActiveSupport::TestCase
  setup do
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'E676B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
  end

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
    refute Claim.submitted.include?(rejected_doctor_attention_claim)
    assert Claim.submitted.include?(done_claim)
  end

  test "reclaim" do
    @claim = create(:claim, patient_number: 17, status: "agent_attention", items: [build(:item, day: Date.new(2014,8,14), rows: [build(:row, code: "P018B", message: "foo", fee: 10000, paid: 32), build(:row, code: "E676B")])])
    reclaim = @claim.reclaim!

    assert_equal reclaim.status, 'for_agent'
    assert_equal @claim.status, 'reclaimed'

    assert_equal reclaim.user, @claim.user
    assert_equal reclaim.photo, @claim.photo

    assert_not_equal reclaim.number, @claim.number

    assert_equal reclaim.patient_number, @claim.patient_number
    assert_equal reclaim.items[0].rows[0].code, @claim.items[0].rows[0].code
    assert_equal reclaim.items[0].rows[0].paid, 0
    assert_nil reclaim.items[0].rows[0]['message']

    assert_equal reclaim.original.id, @claim.id

    reclaim.reload
    assert_equal reclaim.status, 'for_agent'
    assert_equal @claim.status, 'reclaimed'

    assert_equal reclaim.user, @claim.user
    assert_equal reclaim.photo, @claim.photo

    assert_not_equal reclaim.number, @claim.number

    assert_equal reclaim.patient_number, @claim.patient_number
    assert_equal reclaim.items[0].rows[0].code, @claim.items[0].rows[0].code
    assert_equal reclaim.items[0].rows[0].paid, 0
    assert_nil reclaim.items[0].rows[0]['message']

    assert_equal reclaim.original.id, @claim.id
   end

  test "warnings" do
    claim = build(:claim, patient_name: "Jim")
    assert claim.has_warnings?
    assert claim.warnings.has_key?(:patient_name)

    claim = build(:claim, referring_physician: "32")
    assert claim.has_warnings?
    assert claim.warnings.has_key?(:referring_physician)

    claim = build(:claim, patient_number: 17, status: "agent_attention", items: [build(:item, day: Date.new(2014,8,14), rows: [build(:row, code: "P018B", message: "foo", fee: 10000, paid: 32), build(:row, code: "Z999B")])])
    assert claim.items[0].rows[1].has_warnings?
    assert claim.any_warnings?
  end

  test 'empty' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen", patient_birthday: "2011-9-19", patient_province: "ON", patient_number: "9876543217xx", patient_sex: 'F')
    record = claim.to_header_record
    assert_equal record.to_s, "HEH9876543217XX2011091900000000HCPP      1681                                  \r\n"
    assert record.errors.length == 0, record.errors
  end

  test 'RMB' do
    claim = build(:claim, number: 0, patient_province: "NS")
    record = claim.to_header_record
    assert_equal record.to_s, "HEH            2011091900000000RMBP      1681                                  \r\n"
    assert record.errors.length == 0, record.errors
    record = claim.to_rmb_record
    assert_equal record.to_s, "HER9876543217  LARSEN   RUBY 2NS                                               \r\n"
    assert record.errors.length == 0, record.errors
  end

  test 'reversed_name' do
    claim = build(:claim, number: 0, patient_province: "NS", patient_name: "larsen, ruby")
    record = claim.to_header_record
    assert_equal record.to_s, "HEH            2011091900000000RMBP      1681                                  \r\n"
    assert record.errors.length == 0, record.errors
    record = claim.to_rmb_record
    assert_equal record.to_s, "HER9876543217  LARSEN   RUBY 2NS                                               \r\n"
    assert record.errors.length == 0, record.errors
  end

end
