require 'test_helper'

class ErrorReportTest < ActiveSupport::TestCase
  setup do
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'E676B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
    @user = create(:user, provider_number: 18468)
    @claim = build(:claim,
      user: @user,
      status: :for_agent,
      number: 99999999,
      patient_name: "Santina Claus",
      patient_number: "9876543217HO",
      patient_birthday: "1914-12-25",
      patient_sex: "F",
      number: 99999999,
      items:
        [build(:item, day: '2014-08-11', time_in: '09:00', time_out: '10:30',
               rows: [build(:row, code: 'P018B c-section', fee: 16856, units: 14)])])
    create(:error_report_rejection_condition, code: "V09", name: "Foo")
    create(:error_report_explanatory_code, code: "10", name: "Bar")
  end

  def submit
    interactor = GenerateSubmission.new
    interactor.perform(@user, [@claim])
    assert_equal interactor.errors, {}
    @submission = ::Submission.new(interactor.attributes)
    @submission.save!
  end

  test 'er' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                      V09            \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    assert_equal ra.created_at, DateTime.new(2009,5,19)
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_not @submission.claims[0].items[0].rows[0].message.blank?

  end

  test 'er explan' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                    10               \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_not @submission.claims[0].items[0].rows[0].message.blank?

  end

  test 'er multiple codes' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                      V09V09         \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert @submission.claims[0].items[0].rows[0].message.split("\n").length == 2
  end


  test 'er codes in header' do
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                   V09            \r\nHX90000001000000000000000000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert @submission.claims[0].items[0].rows[0].message.blank?
    assert_equal @submission.claims[0].comments.last.body, "- V09: Foo"
  end

  test 'er premium' do
    @claim.items[0].rows.push(build(:row, code: 'E676B', fee: 14448, units: 12))
    submit

    ra = EdtFile.new_child(filename: 'EE018468.637',
                           contents: "HX1V03D          00000000000184680013920090519                                 \r\nHXH9876543217HO1914122599999999HCPP      1681                                  \r\nHXTP018B  0168561420140811                                      V09            \r\nHXTE676B  0144481420140811                                      V09            \r\nHX90000001000000000000010000000                                                \r\n")
    assert_nil ra.process!

    assert_equal ra.user_id, @user.id
    @submission.claims[0].reload
    assert @submission.claims[0].status == 'agent_attention'
    assert_not @submission.claims[0].items[0].rows[0].message.blank?
    assert_not @submission.claims[0].items[0].rows[1].message.blank?

  end
end

