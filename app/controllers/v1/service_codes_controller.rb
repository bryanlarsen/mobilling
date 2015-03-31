class V1::ServiceCodesController < V1::BaseController
  skip_before_action :require_user, only: %i[index show]
  resource_description { resource_id "service_codes" }

  api :GET, "/v1/service_codes", "Returns service_codes"

  def index
    expires_in 7.days, public: true
    service_codes = policy_scope(ServiceCode).map do |sc|
      {
        code: sc.code,
        fee: sc.fee,
        name: sc.name,
        rdc: sc.requires_diagnostic_code
      }
    end
    render json: service_codes
  end

end
