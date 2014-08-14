require "test_helper"

class DoctorAcceptanceTest < ActionDispatch::IntegrationTest
  setup do
    @doctor = Test::Doctor.new
    @doctor.sign_in
  end

  test "can save claim as draft" do
    @doctor.click_on("New")
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.click_on("Save")
    assert @doctor.see?("Alice")
  end

  test "can submit claim" do
    @doctor.click_on("New")
    @doctor.attach_file("Patient photo", file_fixture("image.png"), visible: false)
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.fill_in("Hospital", with: "Test")
    @doctor.fill_in("Referring physician", with: "Bob")
    @doctor.fill_in("Diagnosis", with: "Flu")
    @doctor.fill_in("Admission date", with: "2014-07-02")
    @doctor.fill_in("Last seen date", with: "2014-07-07")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-comprehensive-er")
    @doctor.fill_in_and_blur("Time in", with: "17:00")
    @doctor.fill_in_and_blur("Time out", with: "19:00")
    @doctor.click_element_with_id("is-premium-visible")
    @doctor.click_element_with_id("claim-consult-premium-travel")
    @doctor.click_element_with_id("claim-consult-premium-visit-weekday-office-hours")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    @doctor.click_on("Submit")
    assert @doctor.see?("Alice")
  end

  test "can edit rejected claim" do
    create(:claim, user: @doctor.model, status: "rejected_doctor_attention", details: {"patient_name" => "Alice"})
    @doctor.click_link_with_text("Rejected")
    @doctor.click_on("Alice")
    @doctor.fill_in("Patient name", with: "Bob")
    @doctor.click_on("Save")
    assert @doctor.see?("Bob")
  end

  test "can delete claim" do
    @doctor.click_on("New")
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.click_on("Save")
    @doctor.within_list_item("Alice") do
      @doctor.click_on("remove")
    end
    @doctor.click_on("Delete")
    assert @doctor.not_see?("Alice")
  end

  test "has 'NEW' option on 'Submitted' page" do
    @doctor.open_sidebar
    @doctor.click_link_with_text("Submitted")
    assert @doctor.see?("NEW")
  end

  test "has no message if 'Comprehensive' isn't selected" do
    @doctor.click_on("New")
    @doctor.click_link_with_text("Consult")
    assert @doctor.not_see?("Total time must be equal to or greater than 75 minutes.")
  end

  test "has no message if the total time is equal to or greater than 75 minutes" do
    @doctor.click_on("New")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-comprehensive-er")
    @doctor.fill_in_and_blur("Time in", with: "12:00")
    @doctor.fill_in_and_blur("Time out", with: "13:15")
    @doctor.click_on("Submit")
    @doctor.click_link_with_text("Consult")
    assert @doctor.not_see?("Total time must be equal to or greater than 75 minutes.")
  end

  test "displays message if the total time is less than 75 minutes" do
    @doctor.click_on("New")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-comprehensive-er")
    @doctor.fill_in("Time in", with: "17:00")
    @doctor.fill_in("Time out", with: "17:45")
    @doctor.click_on("Submit")
    @doctor.click_link_with_text("Consult")
    assert @doctor.see?("Total time must be equal to or greater than 75 minutes.")
  end

  test "has 'Time in' and 'Time out' pickers on 'Daily Details' page for codes 'A130' and/or 'C130'"do
    @doctor.click_on("New")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Add a new day")
    @doctor.fill_in("code", with: "A130")
    assert @doctor.see?("Time in")
    assert @doctor.see?("Time out")

    @doctor.fill_in("code", with: "C130")
    assert @doctor.see?("Time in")
    assert @doctor.see?("Time out")
  end

  test "has no 'Time in' and 'Time out' pickers on 'Daily Details' page for other codes"do
    @doctor.click_on("New")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Add a new day")
    @doctor.fill_in("code", with: "C132")
    assert @doctor.not_see?("Time in")
    assert @doctor.not_see?("Time out")
  end

  test "special or travel premium codes should appear" do
    @doctor.click_on("New")
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.fill_in_and_blur("Admission date", with: "2014-07-19")
    @doctor.click_element_with_id("is-first-seen-on-hidden")
    @doctor.fill_in_and_blur("First seen date", with: "2014-07-22")
    @doctor.fill_in_and_blur("Last seen date", with: "2014-07-24")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-general-er")
    @doctor.click_element_with_id("is-premium-visible")
    @doctor.click_element_with_id("claim-consult-premium-visit-weekday-evening")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    @doctor.assert_no_selector("input.ng-invalid")
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
    @doctor.open_sidebar
    @doctor.click_on("Profile")
    @doctor.fill_in("Screen lock PIN", with: "1234")
    @doctor.click_on("Save")
    @doctor.visit(root_path)
    @doctor.open_sidebar
    @doctor.click_on("Lock screen")
    @doctor.fill_in("Pin", with: "1234")
    @doctor.click_on("Unlock")
    assert @doctor.see?("MENU")
  end

  test "sees missing consult warning" do
    @doctor.click_on("New")
    @doctor.fill_in_and_blur("Admission date", with: "2014-07-02")
    @doctor.fill_in_and_blur("Last seen date", with: "2014-07-03")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    assert @doctor.see?("Consult Missing")
    @doctor.click_on("Generate without consult")
    assert @doctor.see?("DAILY DETAILS (2)")
  end

  test "can regenerate details when claim changed" do
    @doctor.click_on("New")
    @doctor.fill_in_and_blur("Admission date", with: "2014-08-05")
    @doctor.fill_in_and_blur("Last seen date", with: "2014-08-06")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-general-er")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    assert @doctor.see?("DAILY DETAILS (4)")
    assert @doctor.find_button("Generate codes", disabled: true)
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-general-non-er")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    assert @doctor.find_button("Generate codes", disabled: true)
  end

  test "should not see a generate codes warning when no consult" do
    @doctor.click_on("New")
    @doctor.fill_in_and_blur("Admission date", with: "2014-08-04")
    @doctor.click_element_with_id("is-first-seen-on-hidden")
    @doctor.fill_in_and_blur("First seen date", with: "2014-08-05")
    @doctor.click_element_with_id("claim-first-seen-consult")
    @doctor.fill_in_and_blur("Last seen date", with: "2014-08-06")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    assert @doctor.see?("DAILY DETAILS (4)")
  end

  test "should see an error when a consult limit is reached" do
    10.times do
      @doctor.click_on("New")
      @doctor.fill_in_and_blur("Admission date", with: "2014-08-11")
      @doctor.click_link_with_text("Consult")
      @doctor.click_element_with_id("claim-consult-type-general-er")
      @doctor.click_element_with_id("is-premium-visible")
      @doctor.click_element_with_id("claim-consult-premium-visit-weekday-office-hours")
      @doctor.click_on("Save")
    end
    @doctor.click_on("New")
    @doctor.fill_in_and_blur("Admission date", with: "2014-08-11")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-general-er")
    @doctor.click_element_with_id("is-premium-visible")
    @doctor.click_element_with_id("claim-consult-premium-visit-weekday-office-hours")
    @doctor.click_on("Submit")
    @doctor.click_link_with_text("Consult")
    assert @doctor.see?("May be used only 10 times in a single day")
  end
end
