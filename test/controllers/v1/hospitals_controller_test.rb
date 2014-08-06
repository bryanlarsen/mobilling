require "test_helper"

class V1::HospitalsControllerTest < ActionController::TestCase
  test "index renders hospitals" do
    create_list(:hospital, 3)
    get :index, format: "json"
    assert_response :ok
  end
end
