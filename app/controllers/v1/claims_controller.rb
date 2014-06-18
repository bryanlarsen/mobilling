class V1::ClaimsController < V1::BaseController
  resource_description do
    resource_id "claims"
  end

  api :GET, "/v1/claims", "Returns claims"

  def index
    @claims = current_user.claims
  end
end
