require "test_helper"

class Claim::RecordTest < ActiveSupport::TestCase
  setup do
    [ ['R441B',  9632],
      ['R441A', 61990],
      ['R442A', 61991],
      ['R441C', 12008],
      ['E676B',  7224],
      ['C998B',  6000],
    ].each do |code, fee|
      create(:service_code, code: code, fee: BigDecimal.new(fee)/100)
    end

    create(:statutory_holiday, day: Date.new(2014,1,1))
  end

  test 'empty' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen, ON 9876543217xx, 2011-9-19, F")
    assert claim.to_record == "HEH9876543217XX2011091900000000HCPP      1681                                  \r\n", claim.to_record.to_yaml
    assert claim.submitted_fee == 0
  end

  test 'RMB' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen, NS 9876543217, 2011-9-19, F")
    assert claim.to_record == <<EOS, claim.to_record.split("\n").to_yaml
HEH            2011091900000000RMBP      1681                                  \r
HER9876543217  LARSEN   RUBY 2NS                                               \r
EOS
    assert claim.submitted_fee == 0
  end

  test '1 claim' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen, ON 9876543217xx, 2011-9-19, F", daily_details: [
    	{code: 'R441A double hip', day:'2014-8-8'}])
    assert claim.to_record == "\
HEH9876543217XX2011091900000000HCPP      1681                                  \r\n\
HETR441A  0619900120140808                                                     \r\n", claim.to_record.split("\n")
    assert claim.submitted_fee == BigDecimal.new("619.90")
  end

end
