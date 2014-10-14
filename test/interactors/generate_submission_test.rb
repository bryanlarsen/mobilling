require "test_helper"

class GenerateSubmission::SubmissionTest < ActiveSupport::TestCase
  setup do
    @interactor = GenerateSubmission.new
    @user = create(:user, provider_number: 18469, group_number: '2468', office_code: 'Q', specialty_code: 99)

    @claim_details = {
      user: @user,
      status: :unprocessed,
      number: 99999999,
      patient_name: "Santina Claus",
      patient_number: "9876543217HO",
      patient_birthday: "1914-12-25",
      patient_sex: "F",
      daily_details:
        [{code: 'P018B c-section', day: '2014-8-11', time_in: '09:00', time_out: '10:30', fee: 16856, units: 14},]
    }
  end

  def check(claims, contents)
    @interactor.perform(@user, claims, DateTime.new(2014,8,10))
    assert @interactor.errors.length == 0, @interactor.errors.to_yaml
    assert @interactor.contents == contents, 'is: '+@interactor.contents.split("\n").to_yaml+'should be: '+contents.split("\n").to_yaml
  end

  test 'empty' do
    check [], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEE0000000000000                                                               \r
EOS
    assert @interactor.batch_id == '201408100000'
  end

  test 'c-section assist' do
    check [build(:claim, @claim_details)], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
  end

  test 'with overtime' do
    dets = @claim_details.clone
    dets[:daily_details][0][:day] = '2014-8-10'
    dets[:daily_details][0][:time_in] = '03:00'
    dets[:daily_details][0][:time_out] = '04:30'
    dets[:daily_details] << dets[:daily_details][0].dup
    dets[:daily_details][1][:code] = 'E401B'
    dets[:daily_details][1][:fee] = 12642
    dets[:daily_details] << {code: 'C999B late call-in', day: '2014-8-10', fee: 10000, units: 1}
    check [build(:claim, dets)], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140810                                                     \r
HETE401B  0126421420140810                                                     \r
HETC999B  0100000120140810                                                     \r
HEE0001000000003                                                               \r
EOS
#    assert s.submitted_fee == 39498
  end

end
