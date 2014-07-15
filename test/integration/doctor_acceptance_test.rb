require "test_helper"

class DoctorAcceptanceTest < ActionDispatch::IntegrationTest
  setup do
    @doctor = Test::Doctor.new
  end

  test "can save claim as draft" do
    @doctor.sign_in
    @doctor.click_on("New")
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.click_on("Save")
    assert @doctor.see?("Alice")
  end

  test "can submit claim" do
    @doctor.sign_in
    @doctor.click_on("New")
    @doctor.attach_file("Patient photo", file_fixture("image.png"), visible: false)
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.fill_in("Hospital", with: "Test")
    @doctor.fill_in("Referring physician", with: "Bob")
    @doctor.fill_in("Diagnosis", with: "Flu")
    @doctor.fill_in("Admission date", with: "2014-04-01")
    @doctor.fill_in("Last seen date", with: "2014-04-07")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-comprehensive-er")
    @doctor.fill_in("Time in", with: "17:00")
    @doctor.fill_in("Time out", with: "19:00")
    @doctor.click_element_with_id("is-premium-visible")
    @doctor.click_element_with_id("claim-consult-premium-travel")
    @doctor.click_element_with_id("claim-consult-premium-visit-weekday-day")
    @doctor.click_link_with_text("Daily Details")
    @doctor.click_on("Generate codes")
    @doctor.click_on("More")
    @doctor.click_on("Submit")
    assert @doctor.see?("Alice")
  end

  test "can delete claim" do
    @doctor.sign_in
    @doctor.click_on("New")
    @doctor.fill_in("Patient name", with: "Alice")
    @doctor.click_on("Save")
    @doctor.click_on("Alice")
    @doctor.click_on("More")
    @doctor.click_on("Delete")
    @doctor.click_on("Delete")
    assert @doctor.not_see?("Alice")
  end

  test "has 'NEW' option on 'Submitted' page" do
    @doctor.sign_in
    @doctor.find(".sidebar-toggle").click
    @doctor.click_on("Submitted")
    assert @doctor.see?("NEW")
  end

  test "has no message if 'Comprehensive' isn't selected" do
    @doctor.sign_in
    @doctor.click_on("New")
    @doctor.click_link_with_text("Consult")
    assert @doctor.not_see?("Total time must be equal to or greater than 75 minutes.")
  end

  test "has no message if the total time is equal to or greater than 75 minutes" do
    @doctor.sign_in
    @doctor.click_on("New")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-comprehensive-er")
    @doctor.fill_in("Time in", with: "12:00")
    @doctor.fill_in("Time out", with: "13:15")
    assert @doctor.not_see?("Total time must be equal to or greater than 75 minutes.")

    @doctor.fill_in("Time in", with: "12:00")
    @doctor.fill_in("Time out", with: "13:25")
    assert @doctor.not_see?("Total time must be equal to or greater than 75 minutes.")
  end

  test "displays message if the total time is less than 75 minutes" do
    @doctor.sign_in
    @doctor.click_on("New")
    @doctor.click_link_with_text("Consult")
    @doctor.click_element_with_id("claim-consult-type-comprehensive-er")
    @doctor.fill_in("Time in", with: "17:00")
    @doctor.fill_in("Time out", with: "17:45")
    assert @doctor.see?("Total time must be equal to or greater than 75 minutes.")
  end
end
