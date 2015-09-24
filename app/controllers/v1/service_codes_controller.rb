class V1::ServiceCodesController < V1::BaseController
  skip_before_action :require_user, only: %i[index show]
  skip_before_action :refresh_session, only: %i[index show]
  resource_description { resource_id "service_codes" }

  api :GET, "/v1/service_codes", "Returns service_codes"

  def pundit_user
    nil
  end

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
    respond_to do |format|
      format.json { render json: service_codes }
      format.html { render json: service_codes }
      format.js { render text: "loadServiceCodes(#{JSON.pretty_generate(service_codes)});\nserviceCodesLoaded = true;" }
    end
  end

end
