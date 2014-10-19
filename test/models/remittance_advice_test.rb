require 'test_helper'

class RemittanceAdviceTest < ActiveSupport::TestCase
  setup do
    @user = create(:user, provider_number: 18468)
  end

  test 'acknowledgment' do
    submission = EdtFile.new_child(filename: 'HH00740.564',
                          contents: <<EOS,
HEBV03D201408100000000000000001846800                                          \r
HEH9876543217HO1914122599999999HCPP      1681                                  \r
HETP018B  0168561420140811                                                     \r
HEE0001000000001                                                               \r
EOS
                                   )
    submission.process!

    ra = EdtFile.new_child(filename: 'PG018468.637',
                           contents: "HR1V030000001846800C220140715JACKSON                  DR BJ001471992 99999999  \r\nHR2                              3 CAMWOOD CRES                                \r\nHR3OTTAWA          ON K2H7X1                                                   \r\nHR4D406253043410184680099999999                   ON9876543217HO  HCP    0000  \r\nHR5D406253043412014081113P018B 016856016856                                    \r\nHR720 2014062500007382-0.5% DISCOUNT OPTED-IN                                  \r\nHR8This is a message from OHIP.                                                \r\nHR8This is the second line of a message from OHIP                              \r\n")
    ra.process!

    assert_equal ra.user_id, @user.id
    submission.claims[0].reload
    assert submission.claims[0].status == 'paid'
    assert submission.claims[0].paid_fee == 16856
  end
end

