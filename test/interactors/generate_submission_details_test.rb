require "test_helper"

class GenerateSubmission::DetailsTest < ActiveSupport::TestCase
  setup do
    @interactor = GenerateSubmission.new
    create(:service_code, code: 'R441A', fee: 61990, requires_diagnostic_code: true)
    create(:service_code, code: 'R441B', fee: 9632, requires_diagnostic_code: false)
    create(:service_code, code: 'R442A', fee: 35325, requires_diagnostic_code: true)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
  end

  test 'details: simple' do
    daily = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1}
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 1  # diagnosis required
  end

  test 'details: simple, blank diagnosis' do
    daily = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1, 'diagnosis' => ''}
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 1  # diagnosis required
  end

  test 'details with diagnosis' do
    daily = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1, 'diagnosis' => 'ringworm 11'}
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert_equal @interactor.contents, "HETR441A  0619900120140808011                                                  \r\n"
    assert @interactor.errors.length == 0
  end

  test 'details with 4 digit diagnosis' do
    daily = {'code' => 'R441A double hip', 'day' =>'2014-8-8', 'fee' => 61990, 'units' => 1, 'diagnosis' => 'ringworm 1109'}
    claim = build(:claim, daily_details: [daily])
    @interactor.generate_details(claim.items[0], claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert_equal @interactor.contents, "HETR441A  06199001201408081109                                                 \r\n"
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
