require "test_helper"

class V1::ClaimsControllerTest < ActionController::TestCase
  test "index renders template" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    create_list(:claim, 3, user: user)
    get :index, format: "json"
    assert_response 200
    assert_equal 3, JSON::parse(response.body).length
  end

  test "index responds with unauthorized when no auth" do
    get :index, format: "json"
    assert_response :unauthorized
  end

  test "show renders template" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    claim = create(:claim, user: user)
    create(:claim_comment, claim: claim, body: "Example comment")
    get :show, id: claim.id, format: "json"
    assert_equal "Example comment", JSON::parse(response.body)['comments'][0]['body']
    assert_response 200
  end

  test "show responds with unauthorized when no auth" do
    user = create(:user)
    get :show, id: create(:claim, user: user).id, format: "json"
    assert_response :unauthorized
  end

  test "show responds with not found when no claim" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    get :show, id: create(:claim).id, format: "json"
    assert_response :not_found
  end

  test "create renders template" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    post :create, format: "json", claim: {status: "saved", specialty: "internal_medicine"}
    assert_equal "internal_medicine", JSON::parse(response.body)['specialty']
    assert_response 200
  end

  test "create responds with unauthorized when no auth" do
    post :create, format: "json", claim: {status: "saved"}
    assert_response :unauthorized
  end

  test "create responds with unprocessable entity when invalid params" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    post :create, format: "json", claim: {status: "invalid"}
    assert JSON::parse(response.body)['errors']['status']
    assert_response :unprocessable_entity
  end

  test "update renders template" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    claim = create(:claim, user: user)
    put :update, id: claim.id, format: "json", claim: {status: "saved", patient_name: "Jane"}
    assert_equal "Jane", JSON::parse(response.body)['patient_name']
    assert_response 200
  end

  test "update responds with unauthorized when no auth" do
    claim = create(:claim)
    put :update, id: claim.id, format: "json", claim: {status: "saved"}
    assert_response :unauthorized
  end

  test "update responds with unprocessable entity when invalid params" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    claim = create(:claim, user: user)
    put :update, id: claim.id, format: "json", claim: {status: "invalid"}
    assert_response :unprocessable_entity
  end

  # test "update responds with not_found when updating unprocessed claim" do
  #   user = create(:user)
  #   @controller.sign_in(user, user.authentication_token)
  #   claim = create(:claim, user: user, status: "ready")
  #   put :update, id: claim.id, format: "json", claim: {status: "saved"}
  #   assert_response :not_found
  # end

  test "destroy renders template" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    claim = create(:claim, user: user)
    delete :destroy, id: claim.id, format: "json"
    assert_response 200
  end

  test "destroy responds with not found when no claim" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    delete :destroy, id: create(:claim).id, format: "json"
    assert_response :not_found
  end

  test "destroy responds with not found when claim is unprocessed" do
    user = create(:user)
    @controller.sign_in(user, user.authentication_token)
    claim = create(:claim, user: user, status: "file_created")
    delete :destroy, id: claim.id, format: "json"
    assert_response :not_found
  end

  test "destroy responds with unauthorized when no auth" do
    claim = create(:claim)
    delete :destroy, id: claim.id, format: "json"
    assert_response :unauthorized
  end
end
