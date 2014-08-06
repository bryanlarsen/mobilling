require "test_helper"

class V1::HospitalsControllerTest < ActionController::TestCase
  test "index renders template" do
    create_list(:hospital, 3)
    get :index, format: "json"
    assert_template "index"
  end
end
