require "test_helper"

class DoctorAcceptanceTest < ActionDispatch::IntegrationTest
  setup do
    @doctor = Test::Doctor.new
    @doctor.sign_in
  end

  test "can save claim as draft" do
    @doctor.add_claim(patient_name: "Alice", last_seen_on: "", autogenerate: false)
    @doctor.click_on("Save")
    assert @doctor.see?("Alice")
  end

  test "can submit claim" do
    @doctor.add_claim(patient_name: "Alice")
    @doctor.click_on("Submit")
    assert @doctor.see?("Alice")
  end

  test "can edit rejected claim" do
    create(:claim, user: @doctor.model, status: "rejected_doctor_attention", details: {"patient_name" => "Alice"})
    @doctor.click_on("Rejected")
    @doctor.click_on("Alice")
    @doctor.fill_in("Patient name", with: "Bob")
    @doctor.click_on("Save")
    assert @doctor.see?("Bob")
  end

  test "can delete claim" do
    @doctor.click_on("New")
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.click_on("Save")
    @doctor.within(".list-group-item", text: "Alice") do
      @doctor.click_on("remove")
    end
    @doctor.click_on("Delete")
    assert @doctor.not_see?("Alice")
  end

  test "displays error message if the total time is less than 75 minutes" do
    @doctor.add_claim(consult_type: "comprehensive_er", consult_time_in: "10:00", consult_time_out: "10:45")
    @doctor.click_on("Submit")
    @doctor.click_on("Consult")
    assert @doctor.see?("Total time must be equal to or greater than 75 minutes.")
  end

  test "has 'Time in' and 'Time out' pickers on 'Details' page for code A130A"do
    @doctor.click_on("New")
    @doctor.click_on("Details")
    @doctor.click_on("Add a new day")
    @doctor.fill_in("code", with: "A130A")
    assert @doctor.see?("Time in")
    assert @doctor.see?("Time out")
  end

  test "has 'Time in' and 'Time out' pickers on 'Details' page for codes C130A"do
    @doctor.click_on("New")
    @doctor.click_on("Details")
    @doctor.click_on("Add a new day")
    @doctor.fill_in("code", with: "C130A")
    assert @doctor.see?("Time in")
    assert @doctor.see?("Time out")
  end

  test "has no 'Time in' and 'Time out' pickers on 'Details' page for other codes"do
    @doctor.click_on("New")
    @doctor.click_on("Details")
    @doctor.click_on("Add a new day")
    @doctor.fill_in("code", with: "C132A")
    assert @doctor.not_see?("Time in")
    assert @doctor.not_see?("Time out")
  end

  test "can reset password" do
    @doctor.sign_out
    @doctor.click_on("Forgot your password?")
    @doctor.fill_in("Email", with: @doctor.email)
    assert_emails(1) do
      @doctor.click_on("Send instructions")
      assert @doctor.see?("Forgot your password?")
    end
    link = URI.extract(@doctor.emails.last.body.to_s, /http|https/).first
    assert link.present?
    assert_emails(1) do
      @doctor.visit(URI.parse(link).request_uri)
      assert @doctor.see?("Success!")
    end
    assert @doctor.emails.last.body.to_s =~ /password: (.*)/
    password = $1
    @doctor.visit(root_path)
    @doctor.fill_in("Email", with: @doctor.email)
    @doctor.fill_in("Password", with: password)
    @doctor.click_on("Sign In")
    assert @doctor.see?("MENU")
  end

  test "can lock screen" do
    @doctor.navigate_to("Profile")
    @doctor.fill_in("Screen lock PIN", with: "1234")
    @doctor.click_on("Save")
    @doctor.visit(root_path)
    @doctor.navigate_to("Lock screen")
    @doctor.fill_in("Pin", with: "1234")
    @doctor.click_on("Unlock")
    assert @doctor.see?("MENU")
  end

  test "sees missing consult warning" do
    @doctor.add_claim(admission_on: "2014-07-02", first_seen_on: "2014-07-02", last_seen_on: "2014-07-03", consult_type: nil, autogenerate: false, daily_details: [])
    @doctor.click_on("Details")
    @doctor.click_on("Generate codes")
    assert @doctor.see?("Consult Missing")
    @doctor.click_on("Generate without consult")
    assert @doctor.see?("DAILY DETAILS (1)")
  end

  test "can regenerate details when claim changed" do
    @doctor.add_claim(consult_type: "comprehensive_er")
    assert @doctor.see?("DAILY DETAILS (8)")
    @doctor.click_on("Details")
    assert @doctor.find_button("Generate codes", disabled: true)
    @doctor.click_on("Consult")
    @doctor.find_by_id("claim-consult-type-comprehensive-non-er").click
    @doctor.click_on("Details")
    @doctor.click_on("Generate codes")
    assert @doctor.find_button("Generate codes", disabled: true)
  end

  test "should not see a generate codes warning when no consult" do
    @doctor.add_claim(admission_on: "2014-08-04", first_seen_on: "2014-08-05", last_seen_on: "2014-08-06", first_seen_consult: false, consult_type: nil, autogenerate: false, daily_details: [])
    @doctor.click_on("Details")
    @doctor.click_on("Generate codes")
    assert @doctor.see?("DAILY DETAILS (2)")
  end

  test "can save claim with multiple diagnoses" do
    @doctor.add_claim(diagnoses: [{name: "Flu"}, {name: "Cold"}])
    @doctor.click_on("Save")
    @doctor.click_on("Alice")
    assert_equal "Flu", @doctor.find_field("claim-diagnoses-0-name").value
    assert_equal "Cold", @doctor.find_field("claim-diagnoses-1-name").value
  end

  test "can submit claim with multiple diagnoses" do
    @doctor.add_claim(diagnoses: [{name: "Flu"}, {name: "Cold"}])
    @doctor.click_on("Submit")
    @doctor.click_on("Alice")
    assert @doctor.see?("Flu")
    assert @doctor.see?("Cold")
  end

  test "cannot choose office hours option over the limit for the same period" do
    10.times do
      @doctor.add_claim(admission_on: "2014-07-02", consult_premium_visit: "weekday_office_hours")
      @doctor.click_on("Save")
    end
    @doctor.add_claim(admission_on: "2014-07-02", consult_premium_visit: "weekday_office_hours")
    @doctor.click_on("Submit")
    @doctor.click_on("Consult")
    assert @doctor.see?("Max visit premium used for selected code")
  end

  test "cannot choose travel premium option over the limit for the same period" do
    2.times do
      @doctor.add_claim(admission_on: "2014-07-02", consult_premium_visit: "weekday_office_hours", consult_premium_travel: true)
      @doctor.click_on("Save")
    end
    @doctor.add_claim(admission_on: "2014-07-02", consult_premium_visit: "weekday_office_hours", consult_premium_travel: true)
    @doctor.click_on("Submit")
    @doctor.click_on("Consult")
    assert @doctor.see?("Max travel premium used")
  end
end
