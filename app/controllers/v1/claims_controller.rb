class V1::ClaimsController < V1::BaseController
  wrap_parameters :claim, include: ClaimForm.all_params.map(&:first), format: :json
  resource_description { resource_id "claims" }

  api :GET, "/v1/claims", "Returns claims"

  def index
    render json: current_user.claims
  end

  api :GET, "/v1/claims/:id", "Returns a claim"

  def show(claim = nil)
    claim ||= current_user.claims.includes(:comments).find(params[:id])
    render json: claim.as_json(include_comments: true)
  end

  # yes, I tried doing this recursively, but the blocks are executed
  # in the context of apipie
  def_param_group :claim do
    param :claim, Hash, required: true do
      ClaimForm.all_params.each do |name, klass, array|
        if klass == Array
          param name, Array do
            array.each do |name, klass, array|
              if klass == Array
                param name, Array do
                  array.each do |name, klass|
                    param name, klass
                  end
                end
              else
                param name, klass
              end
            end
          end
        else
          param name, klass
        end
      end
    end
  end

  api :POST, "/v1/claims", "Creates a claim"
  param_group :claim

  def create
    @form = ClaimForm.new(claim_params)
    @form.user = current_user
    if @form.perform
      show @form.claim
    else
      render json: @form, status: 422
    end
  end


  api :PUT, "/v1/claims/:id", "Updates a claim"
  param_group :claim

  def update
    @claim = current_user.claims.where(status: Claim.statuses.slice(:saved, :for_agent, :doctor_attention, :agent_attention).values).find(params[:id])
    @form = ClaimForm.new(@claim, claim_params)
    @form.user = current_user
    if @form.perform
      show @form.claim
    else
      render json: @form, status: 422
    end
  end

  api :DELETE, "/v1/claims/:id", "Deletes a claim"

  def destroy
    @claim = current_user.claims.saved.find(params[:id])
    @claim.destroy
    show @claim
  end

  private

  def claim_params
    params.require(:claim).permit(ClaimForm.all_param_names)
  end
end
