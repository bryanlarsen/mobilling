class V1::DoctorsController < V1::BaseController
  resource_description { resource_id "doctors" }

  api :GET, "/v1/doctors", "Returns doctors"

  def index
    @doctors = Doctor.all
  end

end