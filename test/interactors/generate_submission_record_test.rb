require "test_helper"

class GenerateSubmission::RecordTest < ActiveSupport::TestCase
  setup do
    @interactor = GenerateSubmission.new
  end

  test 'empty' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen", patient_birthday: "2011-9-19", patient_province: "ON", patient_number: "9876543217xx", patient_sex: 2)
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "HEH9876543217XX2011091900000000HCPP      1681                                  \r\n", @interactor.contents.to_yaml
  end

  test 'RMB' do
    claim = build(:claim, number: 0, patient_province: "NS")
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == <<EOS, @interactor.contents.split("\n").to_yaml
HEH            2011091900000000RMBP      1681                                  \r
HER9876543217  LARSEN   RUBY 2NS                                               \r
EOS
  end

  test 'reversed_name' do
    claim = build(:claim, number: 0, patient_province: "NS", patient_name: "larsen, ruby")
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == <<EOS, @interactor.contents.split("\n").to_yaml
HEH            2011091900000000RMBP      1681                                  \r
HER9876543217  LARSEN   RUBY 2NS                                               \r
EOS
  end

  test '1 claim' do
    claim = build(:claim, number: 0, patient_number: "9876543217xx", daily_details: [
    	{code: 'R441A double hip', day:'2014-8-8', fee: 61990, units: 1}])
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "\
HEH9876543217XX2011091900000000HCPP      1681                                  \r\n\
HETR441A  0619900120140808                                                     \r\n", @interactor.contents.split("\n")
  end

end
