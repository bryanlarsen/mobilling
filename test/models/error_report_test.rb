require 'test_helper'

class ErrorReportTest < ActiveSupport::TestCase
  setup do
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
    create(:error_report_rejection_condition, code: "V09", name: "Foo")
    create(:error_report_explanatory_code, code: "10", name: "Bar")
  end

  def submit
    interactor = GenerateSubmission.new
    interactor.perform(@user, [build(:claim, @claim_details)])
    assert_equal interactor.errors, []
    @submission = ::Submission.new(interactor.attributes)
    @submission.save!
  end

  test 'er' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                      V09            \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_not @submission.claims[0].details['daily_details'][0]['message'].blank?

  end

  test 'er explan' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                    10               \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_not @submission.claims[0].details['daily_details'][0]['message'].blank?

  end

  test 'er multiple codes' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                      V09V09         \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert @submission.claims[0].details['daily_details'][0]['message'].split("\n").length == 2
  end


  test 'er codes in header' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                   V09            \r\nHX90000001000000000000000000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert @submission.claims[0].details['daily_details'][0]['message'].blank?
    assert_equal @submission.claims[0].comments.last.body, "V09: Foo"
  end

  test 'er premium' do
    @claim_details[:daily_details][0]['premiums'] = [ { code: 'E676B', fee: 14448, units: 12 } ]
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                      V09            \r\nHXTE676B  0144481420140811                                      V09            \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_not @submission.claims[0].details['daily_details'][0]['message'].blank?
    assert_not @submission.claims[0].details['daily_details'][0]['premiums'][0]['message'].blank?

  end
end

