require 'test_helper'

class SubmissionTest < ActiveSupport::TestCase
  setup do
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'E676B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
    @agent = create(:user, role: "agent")
    @user = create(:user, provider_number: 18469, agent: @agent)
  end

  test 'saving' do
    interactor = GenerateSubmission.new

    claims = [ build(:claim,
      user: @user,
      status: :ready,
      number: 99999999,
      patient_name: 'Santina Claus, ON 9876543217HO, 1914-12-25, F',
      items: [
        build(:item, day: '2014-8-11', time_in: '09:00', time_out: '10:30', rows: [
          build(:row, code: 'P018B c-section', fee: 16856, units: 14)
    ])])]

    interactor.perform(@user, claims, DateTime.new(2014,8,10))
    assert interactor.errors.length == 0
    assert_equal claims[0].submitted_fee, 16856

    s = Submission.new(interactor.attributes)
    s.save!

    c=Claim.find_by(number: 99999999)
    assert c.submission.id == s.id
    assert_equal c.submitted_fee, 16856
    assert_equal s.submitted_fee, 16856

    cf = ClaimFile.where(edt_file_id: s.id, claim_id: c.id).first
    assert_equal cf.edt_file_type, s.type
  end

  test 'upload submission' do
     s = EdtFile.new_child(filename: 'HH00740.564',
                            contents: <<EOS,
HEBV03D201408100000000000000001846900                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
                           )
    s.process!

    assert_equal s.user_id, @user.id
    assert_equal s.claims[0].patient_number, '9876543217HO'
    assert_equal s.claims[0].payee, 'P'
    assert_equal s.claims[0].payment_program, 'HCP'
    assert_equal s.claims[0].hospital, '1681'
    assert_equal s.claims[0].service_location, ''
    assert_equal s.claims[0].manual_review_indicator, false
    assert_equal s.claims[0].items[0].rows[0].code, 'P018B'
    assert_equal s.claims[0].items[0].day, Date.new(2014,8,11)
    assert_equal s.claims[0].items[0].rows[0].fee, 16856
    assert s.batch_id == '201408100000'
    assert_equal s.claims[0].submitted_fee, 16856
    assert_equal s.submitted_fee, 16856
    assert s.sequence_number == 564

    cf = ClaimFile.where(edt_file_id: s.id, claim_id: s.claims.first).first
    assert_equal cf.edt_file_type, s.type
  end

  test 'with overtime' do
    s = EdtFile.new_child(filename: 'HH00740.564',
                            contents: <<EOS,
HEBV03D201408100000000000000001846900                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140810                                                     \r
HETE401B  0126421420140810                                                     \r
HETC999B  0100000120140810                                                     \r
HEE0001000000003                                                               \r
EOS
                            user_id: @user.id)
    s.process!
    assert s.claims[0].items.length == 3
    assert s.submitted_fee == 39498
  end

  test 'upload invalid file' do
    s = EdtFile.new_child(filename: 'HH00740.564',
                            contents: "invalid",
                            user_id: @user.id)
    assert_raises InvalidValue do
      s.process!
    end
  end

  test 'upload invalid filename' do
    assert_raises RuntimeError do
      EdtFile.new_child(filename: 'invalid',
                        contents: "",
                        user_id: @user.id)
    end
  end

  test 'filename' do
    interactor = GenerateSubmission.new
    interactor.perform(@user, [build(:claim, items: [build(:item, day: Date.new(2014,8,10), rows: [build(:row, fee: 500, units: 1, code: 'P018B')])])], DateTime.new(2014,8,10))
    s = Submission.new(interactor.attributes)
    assert s.filename == 'HH018469.001', s.filename
    assert s.batch_id == '201408100000'
    s.save!
    assert s.submitted_fee == 500

    s2 = Submission.new(interactor.attributes)
    assert s2.filename == 'HH018469.002', s2.filename
  end

end
