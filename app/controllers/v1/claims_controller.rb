class V1::ClaimsController < V1::BaseController
  wrap_parameters :claim, include: ClaimForm.all_params.map(&:first), format: :json
  resource_description { resource_id "claims" }

  api :GET, "/v1/claims", "Returns claims"

  def index
    render json: policy_scope(Claim.select(:id, :number, :status, :user_id, :submitted_fee, :paid_fee, :patient_number, :patient_name).include_comment_counts(current_user.id)).joins("LEFT OUTER JOIN claim_items on claim_items.claim_id = claims.id LEFT OUTER JOIN claim_rows on claim_rows.item_id = claim_items.id").group("claims.id").select("SUM(claim_rows.fee)").select("MIN(claim_items.day)").map {|claim|
      {
        id: claim.id,
        number: claim.number,
        status: claim.status,
        user_id: claim.user_id,
        submitted_fee: claim.submitted_fee,
        paid_fee: claim.paid_fee,
        total_fee: claim.sum || 0,
        patient_number: claim.patient_number,
        patient_name: claim.patient_name,
        service_date: claim.min,
        unread_comments: claim.unread_comments
      }
    }
  end

  api :GET, "/v1/claims/:id", "Returns a claim"

  def show(claim = nil, status = 200)
    claim ||= policy_scope(Claim).includes(:comments).includes(:photo).includes(:rows).find(params[:id])
    authorize claim
    render json: claim.as_json, status: status
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
    authorize :claim, :create?

    last_claim = policy_scope(Claim).order(:updated_at).last
    attrs = claim_params
    attrs['status'] ||= 'saved'
    if last_claim
      attrs['specialty'] = last_claim.specialty if attrs['specialty'].blank?
      attrs['hospital'] ||= last_claim.hospital
    end
    attrs['specialty'] = current_user.default_specialty if attrs['specialty'].blank?
    attrs['specialty'] = 'internal_medicine' if attrs['specialty'].blank?
    attrs['patient_province'] ||= 'ON'
    attrs['patient_sex'] ||= 'F'
    attrs['patient_name'] ||= ''

    if %w[anesthesiologist surgical_assist].include?(attrs['specialty'])
      attrs['most_responsible_physician'] ||= false
    else
      attrs['most_responsible_physician'] ||= true
    end

    attrs['first_seen_consult'] ||= false
    attrs['last_seen_discharge'] ||= false
    attrs['icu_transfer'] ||= false
    attrs['consult_premium_first'] ||= false
    attrs['consult_premium_travel'] ||= false
    attrs['manual_review_indicator'] ||= false
    attrs['diagnoses'] ||= [{name: ""}]
    attrs['admission_on'] ||= Date.today.to_s
    attrs['first_seen_on'] ||= Date.today.to_s
    attrs['last_seen_on'] ||= Date.today.to_s
    attrs['user'] = current_user
    @claim = Claim.new(attrs)
    if @claim.save
      show @claim, 200
    else
      show @claim, 422
    end
  end


  api :PUT, "/v1/claims/:id", "Updates a claim"
  param_group :claim

  def update
    @claim = policy_scope(Claim).find(params[:id])
    authorize @claim, :update?
    if @claim.update_attributes(claim_params)
      show @claim, 200
    else
      show @claim, 422
    end
  end

  api :DELETE, "/v1/claims/:id", "Deletes a claim"

  def destroy
    @claim = Claim.find(params[:id])
    authorize @claim, :destroy?
    @claim.destroy
    show @claim
  end

  private

  def claim_params
    params.require(:claim).permit(ClaimForm.all_param_names)
  end
end
