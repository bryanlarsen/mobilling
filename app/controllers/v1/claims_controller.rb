class V1::ClaimsController < V1::BaseController
  wrap_parameters :claim, include: ClaimForm.all_params.map(&:first), format: :json
  resource_description { resource_id "claims" }

  api :GET, "/v1/claims", "Returns claims"

  def index
    render json: policy_scope(Claim).map {|claim|
      {
        id: claim.id,
        number: claim.number,
        status: claim.status,
        user_id: claim.user_id,
        submitted_fee: claim.submitted_fee,
        paid_fee: claim.paid_fee,
        total_fee: claim.total_fee,
        patient_number: claim.details['patient_number'],
        patient_name: claim.details['patient_name'],
        service_date: claim.service_date
      }
    }
  end

  api :GET, "/v1/claims/:id", "Returns a claim"

  def show(form = nil, status = nil)
    form ||= ClaimForm.new(policy_scope(Claim).includes(:comments).includes(:photo).find(params[:id]))
    authorize form.claim if form.claim
    render json: form.as_json(include_comments: true, include_warnings: true, include_photo: true, include_submission: true, include_total: true, include_files: true, include_consult_counts: true), status: (status ? status : 200)
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
    authorize :claim

    last_claim = Claim.order(:updated_at).last
    attrs = claim_params
    attrs['status'] ||= 'saved'
    if last_claim
      attrs['specialty'] = last_claim.details['specialty'] if attrs['specialty'].blank?
      attrs['hospital'] ||= last_claim.details['hospital']
    end
    attrs['specialty'] = current_user.default_specialty if attrs['specialty'].blank?
    attrs['specialty'] = 'internal_medicine' if attrs['specialty'].blank?
    attrs['patient_province'] ||= 'ON'
    attrs['patient_sex'] ||= 'F'
    attrs['patient_name'] ||= ''
    attrs['most_responsible_physician'] ||= false
    attrs['first_seen_consult'] ||= false
    attrs['last_seen_discharge'] ||= false
    attrs['icu_transfer'] ||= false
    attrs['consult_premium_first'] ||= false
    attrs['consult_premium_travel'] ||= false
    attrs['manual_review_indicator'] ||= false
    attrs['diagnoses'] ||= [{name: ""}]
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
    @claim = policy_scope(Claim).find(params[:id])
    authorize @claim, :update?
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
    @claim = Claim.find(params[:id])
    authorize @claim
    @claim.destroy
    show ClaimForm.new(@claim)
  end

  private

  def claim_params
    params.require(:claim).permit(ClaimForm.all_param_names)
  end
end
