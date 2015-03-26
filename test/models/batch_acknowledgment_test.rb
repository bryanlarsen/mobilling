require 'test_helper'

class BatchAcknowledgmentTest < ActiveSupport::TestCase
  setup do
    @user = create(:user, provider_number: 18468)
    @submission = EdtFile.new_child(filename: 'HH00740.564',
                          contents: <<EOS,
HEBV03D201408100000000000000001846800                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
                                   )
    assert @submission.process!.nil?

  end

  test 'acknowledgment' do
    ack = EdtFile.new_child(filename: 'BF00740.564',
                            contents: "HB1V0300740000000201408100000D406253043930442HCP/WCB00000184680000200000620140625     ***  BATCH TOTALS  ***                        \r\n")
    assert ack.process!.nil?
    assert_equal ack.user_id, @user.id
    assert ack.parent_id == @submission.id
    assert_equal ack.created_at, DateTime.new(2014,6,25)
    assert_equal ack.filename_base, "2015/BF00740"
    assert_equal ack.sequence_number, 564

    @submission.reload
#    assert @submission.status == 'acknowledged'
#    assert @submission.claims[0].status == 'acknowledged'
    assert @submission.claims[0].files.batch_acknowledgments[0] == ack
  end

  test 'batch failure' do
    ack = EdtFile.new_child(filename: 'BF00740.564',
                            contents: "HB1V0300740000000201408100000                       00000184680000300001020141027INVALID COUNTS IN TRAILER RECORD       R           \r\nHB1V0300740000000201408100000                       00000184680000300001020141027     ***  BATCH TOTALS  ***                        \r\n")
    assert_equal ack.process!, nil
    assert_equal ack.user_id, @user.id
    assert ack.parent_id == @submission.id
    @submission.reload
    assert @submission.status == 'rejected'
    assert @submission.claims[0].status == 'for_agent'
    assert @submission.claims[0].files.batch_acknowledgments[0] == ack
    assert_equal @submission.claims[0].comments.last.body, "INVALID COUNTS IN TRAILER RECORD       R"
  end
end

