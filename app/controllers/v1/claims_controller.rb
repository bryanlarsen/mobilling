class V1::ClaimsController < V1::BaseController
  wrap_parameters :claim, include: ClaimForm.all_params.map(&:first), format: :json
  resource_description { resource_id "claims" }

  api :GET, "/v1/claims", "Returns claims"

  def index
    render json: current_user.claims.select(:id, :number, :status).map {|claim| {id: claim.id, number: claim.number, status: claim.status} }
  end

  api :GET, "/v1/claims/:id", "Returns a claim"

  def show(form = nil, status = nil)
    form ||= ClaimForm.new(policy_scope(:claim).includes(:comments).includes(:photo).find(params[:id]))
    render json: form.as_json(include_comments: true, include_warnings: true, include_photo: true), status: (status ? status : 200)
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
    attrs = claim_params
    attrs['status'] ||= 'saved'
    attrs['specialty'] ||= current_user.default_template
    attrs['patient_province'] ||= 'ON'
    attrs['patient_sex'] ||= 'F'
    @form = ClaimForm.new(attrs)
    @form.user = current_user
    if @form.perform
      show @form, 200
    else
      show @form, 422
    end
  end


  api :PUT, "/v1/claims/:id", "Updates a claim"
  param_group :claim

  def update
    @claim = policy_scope(:claim).find(params[:id])
    authorize :claim, :update?
    @form = ClaimForm.new(@claim, claim_params)
    @form.user = current_user
    if @form.perform
      show @form, 200
    else
      show @form, 422
    end
  end

  api :DELETE, "/v1/claims/:id", "Deletes a claim"

  def destroy
    @claim = policy_scope(:claim).where(status: "saved").find(params[:id])
    @claim.destroy
    show ClaimForm.new(@claim)
  end

  private

  def claim_params
    params.require(:claim).permit(ClaimForm.all_param_names)
  end
end
