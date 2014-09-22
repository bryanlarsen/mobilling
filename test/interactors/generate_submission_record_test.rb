require "test_helper"

class GenerateSubmission::RecordTest < ActiveSupport::TestCase
  setup do
    @interactor = GenerateSubmission.new
  end

  test 'empty' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen, ON 9876543217xx, 2011-9-19, F")
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "HEH9876543217XX2011091900000000HCPP      1681                                  \r\n", @interactor.contents.to_yaml
  end

  test 'RMB' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen, NS 9876543217, 2011-9-19, F")
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == <<EOS, @interactor.contents.split("\n").to_yaml
HEH            2011091900000000RMBP      1681                                  \r
HER9876543217  LARSEN   RUBY 2NS                                               \r
EOS
  end

  test '1 claim' do
    claim = build(:claim, number: 0, patient_name: "Ruby Larsen, ON 9876543217xx, 2011-9-19, F", daily_details: [
    	{code: 'R441A double hip', day:'2014-8-8', fee: 61990, units: 1}])
    @interactor.generate_claim(claim)
    assert @interactor.errors.length == 0, @interactor.errors
    assert @interactor.contents == "\
HEH9876543217XX2011091900000000HCPP      1681                                  \r\n\
HETR441A  0619900120140808                                                     \r\n", @interactor.contents.split("\n")
  end

end