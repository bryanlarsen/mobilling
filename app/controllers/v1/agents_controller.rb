class V1::AgentsController < V1::BaseController
  skip_before_action :require_user, only: %i[index]
  skip_before_action :refresh_session, only: %i[index]
  resource_description { resource_id "agents" }

  api :GET, "/v1/agents", "Returns agents"

  def pundit_user
    nil
  end

  def index
    agents = policy_scope(:agent).map &:attributes
    render json: agents, only: %w[id name]
  end
end
