require "test_helper"

class V1::ServiceCodesControllerTest < ActionController::TestCase
  test "index renders codes" do
    get :index, format: "json"
    assert_response :ok
  end
end
