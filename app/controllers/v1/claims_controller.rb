class V1::ClaimsController < V1::BaseController
  resource_description { resource_id "claims" }

  api :GET, "/v1/claims", "Returns claims"

  def index
    @claims = current_user.claims
  end
end
