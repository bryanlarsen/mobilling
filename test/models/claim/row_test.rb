require "test_helper"

class Claim::RowTest < ActiveSupport::TestCase
  setup do
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'P018A', fee: 7224, requires_diagnostic_code: true)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'E676B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
    create(:service_code, code: 'R441A', fee: 61990, requires_diagnostic_code: true)
    create(:service_code, code: 'R441B', fee: 9632, requires_diagnostic_code: false)
    create(:service_code, code: 'R442A', fee: 35325, requires_diagnostic_code: true)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    @item = create(:item, day: Date.new(2014,8,11))
  end

  test "saves successfully with valid attributes" do
    build(:row, code: 'P018B', fee: 7224, units: 1, item: @item).save!
  end

  test "to_record" do
    row = build(:row, code: 'P018B', fee: 16856, units: 14, item: @item)
    assert_equal row.to_record.errors, []
    assert_equal row.to_record.to_s, "HETP018B  0168561420140811                                                     \r\n"
  end

  test "human code" do
    row = build(:row, code: 'p018b c-section', fee: 16856, units: 14, item: @item)
    assert_equal row.to_record.errors, []
    assert_equal row.to_record.to_s, "HETP018B  0168561420140811                                                     \r\n"
  end

  test "errors" do
    row = build(:row, item: @item, code: 'Z999b')
    assert row.has_warnings?
    assert row.warnings.has_key?(:code)
    assert_equal 1, row.warnings.count
  end

  test 'details with diagnosis' do
    item = build(:item, 'day' =>'2014-8-8', 'diagnosis' => 'ringworm 11')
    row = build(:row, 'item' => item, 'code' => 'R441A double hip', 'fee' => 61990, 'units' => 1)
    record = row.to_record
    assert record.errors.length == 0, record.errors
    assert_equal record.to_s, "HETR441A  0619900120140808011                                                  \r\n"
  end

  test 'details: simple' do
    item = build(:item, 'day' =>'2014-8-8')
    row = build(:row, 'item' => item, 'code' => 'R441A double hip', 'fee' => 61990, 'units' => 1)
    record = row.to_record
    assert record.errors.length == 1, record.errors
    assert record.errors[0][0] == :diagnosis
  end

  test 'details: simple, blank diagnosis' do
    item = build(:item, 'day' =>'2014-8-8', 'diagnosis' => '')
    row = build(:row, 'item' => item, 'code' => 'R441A double hip', 'fee' => 61990, 'units' => 1)
    record = row.to_record
    assert record.errors.length == 1, record.errors
    assert record.errors[0][0] == :diagnosis
  end

  test 'details with 4 digit diagnosis' do
    item = build(:item, 'day' =>'2014-8-8', 'diagnosis' => 'ringworm 1109')
    row = build(:row, 'item' => item, 'code' => 'R441A double hip', 'fee' => 61990, 'units' => 1)
    record = row.to_record
    assert record.errors.length == 0, record.errors
    assert_equal record.to_s, "HETR441A  06199001201408081109                                                 \r\n"
  end

  test 'premium diagnosis' do
    item = build(:item, 'day' =>'2014-8-8', 'diagnosis' => 'ringworm 1109')
    row = build(:row, 'item' => item, 'code' => 'R441A double hip', 'fee' => 61990, 'units' => 1)
    row2 = build(:row, 'item' => item, 'code' => 'R442A', 'fee' => 35325, 'units' => 1)
    record = row.to_record
    assert record.errors.length == 0, record.errors
    assert_equal record.to_s, "HETR441A  06199001201408081109                                                 \r\n"
    record = row2.to_record
    assert record.errors.length == 0, record.errors
    assert_equal record.to_s, "HETR442A  03532501201408081109                                                 \r\n"
  end

  test 'details assisting' do
    item = build(:item, 'time_in' => '9:00', 'time_out' => '11:30', 'day' =>'2014-8-8')
    row = build(:row, 'item' => item, 'code' => 'R441B double hip', 'fee' => 28896, 'units' => 24)
    record = row.to_record
    assert record.errors.length == 0, record.errors
    assert_equal record.to_s, "HETR441B  0288962420140808                                                     \r\n"
  end
end
