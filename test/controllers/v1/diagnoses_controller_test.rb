require "test_helper"

class V1::DiagnosesControllerTest < ActionController::TestCase
  test "index renders diagnoses" do
    create_list(:diagnosis, 3)
    get :index, format: "json"
    assert_response :ok
  end
end
