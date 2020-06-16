require "test_helper"

class GenerateSubmission::SubmissionTest < ActiveSupport::TestCase
  setup do
    @interactor = GenerateSubmission.new
    @user = create(:user, provider_number: 18469, group_number: '2468', office_code: 'Q', specialty_code: 99)
    @pil = create(:user, provider_number: 23575, group_number: '0000', office_code: 'D', specialty_code: 0)
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
    create(:service_code, code: 'A933A', fee: 7990, requires_diagnostic_code: true)
    create(:service_code, code: 'E082A', fee: 1, requires_diagnostic_code: false)
    create(:service_code, code: 'C994A', fee: 6000, requires_diagnostic_code: false)
    create(:service_code, code: 'C962A', fee: 3640, requires_diagnostic_code: false)
    create(:service_code, code: 'H409A', fee: 17000, requires_diagnostic_code: false)

    @claim_details = {
      user: @user,
      status: :for_agent,
      number: 99999999,
      patient_name: "Santina Claus",
      patient_number: "9876543217HO",
      patient_birthday: "1914-12-25",
      patient_sex: "F",
    }

    @item_details = {}
    @row_details = {}
  end

  def check(claims, contents)
    user = claims[0] ? claims[0].user : @user
    @interactor.perform(user, claims, DateTime.new(2014,8,10))
    assert @interactor.errors.length == 0, @interactor.errors.to_yaml
    assert @interactor.contents == contents, 'is: '+@interactor.contents.split("\n").to_yaml+'should be: '+contents.split("\n").to_yaml
    claims.each do |claim|
      assert_equal claim.status, 'file_created'
    end
  end

  test 'empty' do
    check [], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEE0000000000000                                                               \r
EOS
    assert @interactor.batch_id == '201408100000'
  end

  test 'covid' do
    dets = {user: @user, status: :for_agent, number: 99999999, patient_name: "", patient_number: "", patient_birthday: "", patient_sex: "F"}
    dets['items'] = [build(:item, day: '2014-8-11', time_in: '09:00', time_out: '10:30', rows: [build(:row, code: 'H409A COVID', fee: 17000, units: 2)])]
    check [build(:claim, dets)], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEH                    99999999HCPP      1681                                  \r
HETH409A  0170000220140811                                                     \r
HEE0001000000001                                                               \r
EOS
  end

  test 'c-section assist' do
    dets = @claim_details.clone
    dets['items'] = [build(:item, day: '2014-8-11', time_in: '09:00', time_out: '10:30', rows: [build(:row, code: 'P018B c-section', fee: 16856, units: 14)])]
    check [build(:claim, dets)], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
  end

  test 'with overtime' do
    dets = @claim_details.clone
    dets['items'] = [build(:item, day: '2014-8-10', time_in: '03:00', time_out: '04:30', rows: [build(:row, code: 'P018B c-section', fee: 16856, units: 14), build(:row, code: 'E401B', fee: 12642, units: 14), build(:row, code: 'C999B late call-in', fee: 10000, units: 1)])]
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

  test 'rmb' do
    dets = @claim_details.clone
    dets[:patient_province] = 'NS'
    dets[:patient_number] = '1234567890'
    dets['items'] = [build(:item, day: '2014-8-11', time_in: '09:00', time_out: '10:30', rows: [build(:row, code: 'P018B c-section', fee: 16856, units: 14)])]
    check [build(:claim, dets)], <<EOS
HEBV03Q201408100000000000246801846999                                          \r
HEH            1914122599999999RMBP      1681                                  \r
HER1234567890  CLAUS    SANTI2NS                                               \r
HETP018B  0168561420140811                                                     \r
HEE0001000100001                                                               \r
EOS
  end

  test 'pil' do
    dets = @claim_details.clone
    dets[:user] = @pil
    dets[:patient_number] = "9876543217"
    dets[:hospital] = "1801"
    dets[:patient_birthday] = "1957-04-25"
    dets[:number] = 22853601
    dets[:admission_on] = "2015-01-27"
    dets['items'] = [build(:item, day: '2015-01-27', diagnosis: '799', rows: [build(:row, code: 'A933A', fee: 7990, units: 1), build(:row, code: 'E082A', fee: 2397, units: 1), build(:row, code: 'C994A', fee: 6000, units: 1), build(:row, code: 'C962A', fee: 3640, units: 1)])]
    check [build(:claim, dets)], <<EOS
HEBV03D201408100000000000000002357500                                          \r
HEH9876543217  1957042522853601HCPP      180120150127                          \r
HETA933A  0079900120150127799                                                  \r
HETE082A  0023970120150127                                                     \r
HETC994A  0060000120150127                                                     \r
HETC962A  0036400120150127                                                     \r
HEE0001000000004                                                               \r
EOS
  end
end
