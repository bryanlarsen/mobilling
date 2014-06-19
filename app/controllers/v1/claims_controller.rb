class V1::ClaimsController < V1::BaseController
  wrap_parameters :claim, include: [:id, :patient_name, :hospital, :referring_physician, :diagnosis, :admission_on, :first_seen_on, :last_seen_on, :most_responsible_physician, :last_seen_discharge], format: :json
  resource_description { resource_id "claims" }

  api :GET, "/v1/claims", "Returns claims"

  def index
    @claims = current_user.claims
  end

  api :GET, "/v1/claims/:id", "Returns a claim"

  def show
    @claim = current_user.claims.find(params[:id])
  end

  api :PUT, "/v1/claims/:id", "Updates a claim"
  param :claim, Hash, required: true do
    param :patient_name, String
    param :hospital, String
    param :referring_physician, String
    param :diagnosis, String
    param :most_responsible_physician, :bool
    param :admission_on, String
    param :first_seen_on, String
    param :last_seen_on, String
    param :last_seen_discharge, :bool
  end

  def update
    @interactor = UpdateClaim.new(update_claim_params)
    @interactor.user = current_user
    @interactor.perform
    respond_with @interactor, location: nil
  end

  private

  def update_claim_params
    params.require(:claim).permit(:id, :patient_name, :hospital, :referring_physician, :diagnosis, :admission_on, :first_seen_on, :last_seen_on, :most_responsible_physician, :last_seen_discharge)
  end
end
