require "test_helper"

class V1::AgentsControllerTest < ActionController::TestCase
  test "index renders template" do
    create_list(:admin_user, 3, role: "agent")
    get :index, format: "json"
    assert_template "index"
  end
end
