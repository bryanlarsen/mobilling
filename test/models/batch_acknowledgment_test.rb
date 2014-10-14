require 'test_helper'

class BatchAcknowledgmentTest < ActiveSupport::TestCase
  setup do
    @user = create(:user)
  end

  test 'acknowledgment' do
    submission = EdtFile.new_child(filename: 'HH00740.564',
                          contents: <<EOS,
HEBV03D201408100000000000000001846800                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
                            user_id: @user.id)
    submission.process!

    ack = EdtFile.new_child(filename: 'BF00740.564',
                            contents: "HB1V0300740000000201408100000D406253043930442HCP/WCB00000184680000200000620140625     ***  BATCH TOTALS  ***                        \r\n",
                            user_id: @user.id)
    ack.process!
    assert ack.parent_id == submission.id
    submission.reload
    assert submission.status == 'acknowledged'
    assert submission.claims[0].status == 'acknowledged'
    assert submission.claims[0].batch_acknowledgment == ack
  end
end

