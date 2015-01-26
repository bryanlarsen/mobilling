require "test_helper"

class V1::AgentsControllerTest < ActionController::TestCase
  test "index renders template" do
    create_list(:admin_user, 3, role: "agent")
    get :index, format: "json"
    assert_response 200
    assert_equal 3, JSON::parse(response.body).length
  end
end
