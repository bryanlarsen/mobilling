require "test_helper"

class Claim::DetailsTest < ActiveSupport::TestCase
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

  test 'details: empty' do
    claim = build(:claim)
    assert claim.details_records == "", claim.details_records
  end

  test 'details: simple' do
    claim = build(:claim, daily_details: [{code: 'R441A double hip', day:'2014-8-8'}])
    assert claim.details_records == "HETR441A  0619900120140808                                                     \r\n", claim.details_records.to_yaml
  end

  test 'details: two claims' do
    claim = build(:claim, daily_details: [{code: 'R441A double hip', day:'2014-8-8'}, {code: 'R442A', day:'2014-8-7'}])
    assert claim.details_records == 
     "HETR441A  0619900120140808                                                     \r\n" + 
     "HETR442A  0619910120140807                                                     \r\n",
      claim.details_records.to_yaml
  end

  test 'details with diagnosis' do
    claim = build(:claim, daily_details: [{code: 'R441A double hip', day:'2014-8-8'}], diagnosis: 'ringworm 110')
    assert claim.details_records == "HETR441A  0619900120140808110                                                  \r\n", claim.details_records.to_yaml
  end

  test 'details: assisting' do
    claim = build(:claim, daily_details: [{code: 'R441B double hip', day:'2014-8-8', time_in: '9:00', time_out: '11:30'}])
    assert claim.details_records == "HETR441B  0288962420140808                                                     \r\n", claim.details_records.to_yaml
  end
end
