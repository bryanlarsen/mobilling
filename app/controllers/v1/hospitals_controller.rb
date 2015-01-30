class V1::HospitalsController < V1::BaseController
  skip_before_action :require_user, only: %i[index]
  resource_description { resource_id "hospitals" }

  api :GET, "/v1/hospitals", "Returns hospitals"

  def index
    expires_in 7.days, public: true
    @hospitals = policy_scope(Hospital).pluck(:name)
    render json: @hospitals
  end
end
