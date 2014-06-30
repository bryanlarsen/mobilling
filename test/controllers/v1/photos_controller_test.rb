require "test_helper"

class V1::PhotosControllerTest < ActionController::TestCase
  test "create responds with created" do
    user = create(:user, :authenticated)
    post :create, photo: {file: Rack::Test::UploadedFile.new(file_fixture("image.png")) }, auth: user.authentication_token, format: "json"
    assert_response :created
  end

  test "create responds with unauthorized when no auth" do
    post :create, photo: {file: nil}, format: "json"
    assert_response :unauthorized
  end

  test "create responds with unprocessable entity" do
    user = create(:user, :authenticated)
    post :create, photo: {file: nil}, auth: user.authentication_token, format: "json"
    assert_response :unprocessable_entity
  end
end
