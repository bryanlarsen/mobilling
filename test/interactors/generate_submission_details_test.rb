require "test_helper"

class GenerateSubmission::DetailsTest < ActiveSupport::TestCase
  setup do
    @interactor = GenerateSubmission.new
  end

  test 'details: simple' do
    daily = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1}
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "HETR441A  0619900120140808                                                     \r\n", @interactor.contents.to_yaml
  end

  test 'details: two claims' do
    daily1 = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1}
    daily2 = {'code' => 'R442A', 'day' =>'2014-8-7', 'fee' => 61991, 'units' => 1}
    claim = build(:claim, daily_details: [daily1, daily2])
    @interactor.generate_details(claim.items[0], claim)
    @interactor.generate_details(claim.items[1], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents ==
     "HETR441A  0619900120140808                                                     \r\n" +
     "HETR442A  0619910120140807                                                     \r\n",
      @interactor.contents.to_yaml
  end

  test 'details with diagnosis' do
    daily = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1}
    claim = build(:claim, daily_details: [daily], diagnosis: 'ringworm 110')
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "HETR441A  0619900120140808110                                                  \r\n", @interactor.contents.to_yaml
    assert @interactor.errors.length == 0
  end

  test 'details assisting' do
    daily = {'code' => 'R441B double hip', 'day' =>'2014-8-8', 'time_in' => '9:00', 'time_out' => '11:30', 'fee' => 28896, 'units' => 24}
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "HETR441B  0288962420140808                                                     \r\n", @interactor.contents.to_yaml
  end

  test 'details premiums' do
    daily = {'code' => 'R441B double hip', 'day' =>'2014-8-8', 'time_in' => '9:00', 'time_out' => '11:30', 'fee' => 28896, 'units' => 24, 'premiums' => [ { 'code' => 'E401B', 'fee' => 12642, 'units' => 14 }, { 'code' => 'C999B late call-in', 'fee' => 10000, 'units' => 1 } ] }
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert_equal "HETR441B  0288962420140808                                                     \r\nHETE401B  0126421420140808                                                     \r\nHETC999B  0100000120140808                                                     \r\n", @interactor.contents
  end
end
