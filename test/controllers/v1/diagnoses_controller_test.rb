require "test_helper"

class V1::DiagnosesControllerTest < ActionController::TestCase
  test "index renders template" do
    create_list(:diagnosis, 3)
    get :index, format: "json"
    assert_template "index"
  end
end
