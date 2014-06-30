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

  test "show renders template" do
    user = create(:user, :authenticated)
    get :show, id: create(:claim, user: user).id, auth: user.authentication_token, format: "json"
    assert_template "show"
  end

  test "show responds with unauthorized when no auth" do
    user = create(:user, :authenticated)
    get :show, id: create(:claim, user: user).id, format: "json"
    assert_response :unauthorized
  end

  test "show responds with not found when no claim" do
    user = create(:user, :authenticated)
    get :show, id: create(:claim).id, auth: user.authentication_token, format: "json"
    assert_response :not_found
  end

  test "update renders template" do
    user = create(:user, :authenticated)
    uuid = SecureRandom.uuid
    put :update, id: uuid, auth: user.authentication_token, format: "json", claim: {id: uuid, status: "saved"}
    assert_template "update"
  end

  test "update responds with unauthorized when no auth" do
    uuid = SecureRandom.uuid
    put :update, id: uuid, format: "json", claim: {id: uuid}
    assert_response :unauthorized
  end

  test "update responds with unprocessable entity when invalid params" do
    user = create(:user, :authenticated)
    put :update, id: "invalid", format: "json", claim: {id: "invalid"}, auth: user.authentication_token
    assert_response :unprocessable_entity
  end
end
