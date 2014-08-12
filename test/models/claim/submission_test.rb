require "test_helper"

class Claim::SubmissionTest < ActiveSupport::TestCase
  setup do
    [ ['R441B',  9632],
      ['R441A', 61990],
      ['R442A', 61991],
      ['R441C', 12008],
      ['E676B',  7224],
      ['C998B',  6000],
      ['C999B', 10000],
      ['P018B',  7224],
      ['E400B',   602],
      ['E401B',   903],
    ].each do |code, fee|
      create(:service_code, code: code, fee: BigDecimal.new(fee)/100)
    end

    create(:statutory_holiday, day: Date.new(2014,1,1))

    @user = create(:user)

    @claim_details = {
      user: @user,
      status: :unprocessed,
      number: 99999999,
      patient_name: 'Santina Claus, ON 9876543217HO, 1914-12-25, F',
      daily_details:
        [{code: 'P018B c-section', day: '2014-8-11', time_in: '09:00', time_out: '10:30'},]
    }
  end

  def check(submission, contents)
    assert submission.contents == contents, 'is: '+submission.contents.split("\n").to_yaml+'should be: '+contents.split("\n").to_yaml
  end

  test 'empty' do
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    check s, <<EOS
HEBV03D201408100000000000000001846800                                          \r
HEE0000000000000                                                               \r
EOS
  end

  test 'c-section assist' do
    create(:claim, @claim_details)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    check s, <<EOS
HEBV03D201408100000000000000001846800                                          \r
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
    dets[:daily_details] << {code: 'C999B late call-in', day: '2014-8-10'}
    create(:claim, dets)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    check s, <<EOS
HEBV03D201408100000000000000001846800                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140810                                                     \r
HETE401B  0126421420140810                                                     \r
HETC999B  0100000120140810                                                     \r
HEE0001000000003                                                               \r
EOS
  end

  test 'that submission_id gets saved' do
    create(:claim, @claim_details)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    s.save!
    c=Claim.find_by(number: 99999999)
    assert c.submission_id == s.id
  end

  test 'filename' do
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    assert s.filename == 'HH018468.001', s.filename
    s.save!
    s2 = Submission.generate(@user, DateTime.new(2014,8,10))
    assert s2.filename == 'HH018468.002', s2.filename
  end


end
