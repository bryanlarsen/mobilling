require "test_helper"

class Claim::SubmissionTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)

    @claim_details = {
      user: @user,
      status: :unprocessed,
      number: 99999999,
      patient_name: 'Santina Claus, ON 9876543217HO, 1914-12-25, F',
      daily_details:
        [{code: 'P018B c-section', day: '2014-8-11', time_in: '09:00', time_out: '10:30', fee: 16856, units: 14},]
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
    assert s.submitted_fee == 0
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
    assert s.submitted_fee == 16856
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
    assert s.submitted_fee == 39498
  end

  test 'that submission_id gets saved' do
    create(:claim, @claim_details)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    s.save!
    c=Claim.find_by(number: 99999999)
    assert c.submission_id == s.id
    assert s.submitted_fee == 16856
  end

  test 'upload submission' do
    s = EdtFile.new_child(filename: 'HH00740.564',
                            contents: <<EOS,
HEBV03D201408100000000000000001846800                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
                            user_id: @user.id)
    s.process!
    assert s.claims[0].details['daily_details'][0]['code'] == 'P018B'
    assert s.claims[0].details['daily_details'][0]['day'] == '2014-08-11'
    assert s.claims[0].details['daily_details'][0]['fee'] == 16856
    assert s.batch_id == '201408100000'
    assert s.submitted_fee == 16856
    assert s.sequence_number == 564
  end

  test 'filename' do
    create(:claim, @claim_details)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    assert s.filename == 'HH018468.001', s.filename
    assert s.batch_id == '201408100000'
    s.save!
    assert s.submitted_fee == 16856
    s2 = Submission.generate(@user, DateTime.new(2014,8,10))
    assert s2.filename == 'HH018468.002', s2.filename
    assert s2.submitted_fee == 0
  end

  test 'acknowledgment' do
    create(:claim, @claim_details)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    s.save!
    ack = EdtFile.new_child(filename: 'BF00740.564',
                            contents: "HB1V0300740000000201408100000D406253043930442HCP/WCB00000184680000200000620140625     ***  BATCH TOTALS  ***                        \r\n",
                            user_id: @user.id)
    ack.process!
    assert ack.parent_id == s.id
    s.reload
    assert s.status == 'acknowledged'
    s.claims[0].reload
    assert s.claims[0].status == 'processed'
    assert s.claims[0].batch_acknowledgment == ack
  end

  test 'remittance_advice' do
    create(:claim, @claim_details)
    s = Submission.generate(@user, DateTime.new(2014,8,10))
    s.save!
    ra = EdtFile.new_child(filename: 'PG018468.637',
                            user_id: @user.id,
                           contents: "HR1V030000001846800C220140715JACKSON                  DR BJ001471992 99999999  \r\nHR2                              3 CAMWOOD CRES                                \r\nHR3OTTAWA          ON K2H7X1                                                   \r\nHR4D406253043410184680099999999                   ON9876543217HO  HCP    0000  \r\nHR5D406253043412014081113P018B 016856016856                                    \r\nHR720 2014062500007382-0.5% DISCOUNT OPTED-IN                                  \r\nHR8This is a message from OHIP.                                                \r\nHR8This is the second line of a message from OHIP                              \r\n")
    ra.process!

    s.claims[0].reload
    assert s.claims[0].status == 'paid'
    assert s.claims[0].paid_fee == 16856
  end

end
