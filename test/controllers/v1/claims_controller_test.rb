require "test_helper"

class V1::ClaimsControllerTest < ActionController::TestCase
  test "index renders template" do
    user = create(:user, :authenticated)
    create_list(:claim, 3, user: user)
    get :index, auth: user.authentication_token, format: "json"
    assert_template "index"
  end

  test "index responds with unauthorized when no auth" do
    get :index, format: "json"
    assert_response :unauthorized
  end
end
