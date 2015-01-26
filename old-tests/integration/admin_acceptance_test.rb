require "test_helper"

class AdminTest < ActionDispatch::IntegrationTest
  setup do
    @admin = Test::Admin.new
    @admin.sign_in
  end

  test "admin can change patient name in claim" do
    create(:claim, details: {"patient_name" => "Alice"})
    @admin.navigate_to("Claims")
    @admin.within("tr", text: "Alice") do
      @admin.click_on("View")
    end
    @admin.fill_in("Patient Name", with: "Bob")
    @admin.click_on("Update")
    @admin.see?("Bob")
  end

  test "admin can change doctor name" do
    create(:user, name: "Alice")
    @admin.navigate_to("Users")
    @admin.within("tr", text: "Alice") do
      @admin.click_on("Edit")
    end
    @admin.fill_in("Name", with: "Bob")
    @admin.click_on("Update")
    @admin.see?("Bob")
  end

  test "admin can remove a doctor" do
    create(:user, name: "House")
    @admin.navigate_to("Users")
    @admin.see?("House")
    @admin.within("tr", text: "House") do
      @admin.click_on("Edit")
    end
    @admin.click_on("Delete")
    assert @admin.not_see?("House")
  end

  test "admin can add an agent" do
    @admin.navigate_to("Admins / Agents")
    @admin.click_on("New")
    @admin.fill_in("Name", with: "Bob")
    @admin.fill_in("Email", with: "bob@example.com")
    @admin.fill_in("Password", with: "secret")
    @admin.fill_in("Password confirmation", with: "secret")
    @admin.select("agent", from: "Role")
    @admin.click_on("Create")
    assert @admin.see?("Bob")
  end

  test "admin can see multiple diagnoses" do
    create(:claim, details: {"patient_name" => "Alice", "diagnoses" => [{"name" => "First diagnosis"}, {"name" => "Second diagnosis"}]})
    @admin.navigate_to("Claims")
    @admin.within("tr", text: "Alice") do
      @admin.click_on("View")
    end
    @admin.see?("First diagnosis")
    @admin.see?("Second diagnosis")
  end
end
