class V1::PhotosController < V1::BaseController
  api :POST, "/v1/photos", "Creates a photo"
  param :photo, Hash, required: true do
    param :file, File, desc: "Photo", required: true
  end

  def create
    @interactor = CreatePhoto.new(create_photo_params)
    @interactor.user = current_user
    @interactor.perform
    respond_with @interactor, location: nil, status: :created
  end

  private

  def create_photo_params
    params.require(:photo).permit(:file)
  end
end
