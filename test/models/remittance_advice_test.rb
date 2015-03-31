require 'test_helper'

class RemittanceAdviceTest < ActiveSupport::TestCase
  setup do
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'E676B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
    @user = create(:user, provider_number: 18468)
    @claim_details = {
      user: @user,
      status: :for_agent,
      number: 99999999,
      patient_name: "Santina Claus",
      patient_number: "9876543217HO",
      patient_birthday: "1914-12-25",
      patient_sex: "F",
      number: 99999999,
      daily_details:
        [{code: 'P018B c-section', day: '2014-08-11', time_in: '09:00', time_out: '10:30', fee: 16856, units: 14},]
    }
    create(:remittance_advice_code, code: "D8", name: "Allowed with specific procedures only")
  end

  def submit
    interactor = GenerateSubmission.new
    interactor.perform(@user, [build(:claim, @claim_details)])
    assert_equal interactor.errors, {}
    @submission = ::Submission.new(interactor.attributes)
    @submission.save!
  end

  test 'ra' do
    submit

    ra = EdtFile.new_child(filename: 'PG018468.637',
                           contents: "HR1V030000001846800C220140715JACKSON                  DR BJ001471992 99999999  \r\nHR4D406253043410184680099999999                   ON9876543217HO  HCP    0000  \r\nHR5D406253043412014081113P018B 016856016856                                    \r\nHR720 2014062500007382-0.5% DISCOUNT OPTED-IN                                  \r\nHR8This is a message from OHIP.                                                \r\nHR8This is the second line of a message from OHIP                              \r\nHR8****************************************************************************\r\nHR8This is another message from OHIP                                           \r\n")
    assert ra.process!.nil?

    assert_equal ra.user_id, @user.id
    assert_equal ra.created_at, DateTime.new(2014,7,15)
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'done'
    assert @submission.claims[0].paid_fee == 16856
    assert @submission.claims[0].details['daily_details'][0]['paid'] = 16856
    assert @submission.claims[0].details['daily_details'][0]['message'].blank?
    assert_equal ra.messages[0], "$14719.92 paid on July 15, 2014."
    assert_equal ra.messages[-2], "This is a message from OHIP.\nThis is the second line of a message from OHIP\n"
    assert_equal ra.messages[-1], "This is another message from OHIP\n"
  end

  test 'ra not paid' do
    submit

    ra = EdtFile.new_child(filename: 'PG018468.637',
                           contents: "HR1V030000001846800C220140715JACKSON                  DR BJ001471992 99999999  \r\nHR2                              3 CAMWOOD CRES                                \r\nHR3OTTAWA          ON K2H7X1                                                   \r\nHR4D406253043410184680099999999                   ON9876543217HO  HCP    0000  \r\nHR5D406253043412014081113P018B 016856000000 D8                                 \r\n")
    assert ra.process!.nil?

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert @submission.claims[0].paid_fee == 0
    assert @submission.claims[0].details['daily_details'][0]['paid'] == 0
    assert @submission.claims[0].details['daily_details'][0]['message'].starts_with?("D8: Allowed with")
  end

  test 'ra premium' do
    @claim_details[:daily_details][0]['premiums'] = [ { code: 'E676B', fee: 14448, units: 12 } ]
    submit

    ra = EdtFile.new_child(filename: 'PG018468.637',
                           contents: "HR1V030000001846800C220140715JACKSON                  DR BJ001471992 99999999  \r\nHR4D406253043410184680099999999                   ON9876543217HO  HCP    0000  \r\nHR5D406253043412014081113P018B 016856016856                                    \r\nHR5D406253043412014081113E676B 014448000001 D8                                 \r\n")
    assert ra.process!.nil?

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_equal @submission.claims[0].paid_fee, 16857
    assert @submission.claims[0].details['daily_details'][0]['paid'] == 16856
    assert @submission.claims[0].details['daily_details'][0]['message'].blank?
    assert @submission.claims[0].details['daily_details'][0]['premiums'][0]['paid'] == 1
    assert @submission.claims[0].details['daily_details'][0]['premiums'][0]['message'].starts_with?("D8: Allowed with")
  end

end

