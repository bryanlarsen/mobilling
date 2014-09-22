class V1::ServiceCodesController < V1::BaseController
  skip_before_action :require_user, only: %i[index show]
  resource_description { resource_id "service_codes" }

  api :GET, "/v1/service_codes", "Returns service_codes"

  def index
    @service_codes = ServiceCode.pluck(:name)
    render json: @service_codes
  end

  def show
    @service_code = ServiceCode.find_by(code: params[:id])
    render json: @service_code, only: %w[name code fee requires_specialist]
  end

end
