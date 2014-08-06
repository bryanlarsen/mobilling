require "test_helper"

class V1::ServiceCodesControllerTest < ActionController::TestCase
  test "index renders template" do
    create_list(:service_code, 3)
    get :index, format: "json"
    assert_template "index"
  end
end
