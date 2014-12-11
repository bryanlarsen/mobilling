class Admin::ClaimsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[claims.number users.name claims.status claims.details->>'patient_name']

  helper_method :user_id_filter, :status_filter

  def index
    @claims = policy_scope(:claim).where(filters).order("#{sort_column} #{sort_direction}")
    authorize :claim, :read?
  end

  def edit
    @claim = policy_scope(:claim).includes(:comments).includes(:photo).find(params[:id])
    authorize :claim, :update?
    @form = ClaimForm.new(@claim)
    @user = current_user
  end

  def update
    @claim = policy_scope(:claim).find(params[:id])
    authorize :claim, :update?
    @form = ClaimForm.new(@claim, update_claim_params)
    success = @form.perform

    respond_to do |format|
      format.html do
        if success
          if params[:next_button] && params[:next].split(',')[0]
            redirect_to edit_admin_claim_path(params[:next].split(',')[0], next: params[:next].split(',')[1..-1])
          else
            redirect_to admin_claims_path, notice: "Claim updated successfully."
          end
        else
          render :edit
        end
      end
      format.json do
        render json: @form.as_json(include_warnings: true), status: success ? 200 : 422
      end
    end
  end

  def reclaim
    @claim = policy_scope(:claim).find(params[:id])
    authorize :claim, :update?
    @reclaim = @claim.reclaim!
    redirect_to edit_admin_claim_path(@reclaim)
  end

  private

  def user_id_filter
    if params.key?(:user_id)
      cookies[:claims_index_user_id_filter] = params[:user_id]
    else
      cookies[:claims_index_user_id_filter]
    end
  end

  def status_filter
    if params.key?(:status)
      cookies[:claims_index_status_filter] = Array.wrap(params[:status]).select(&:present?)
    else
      cookies[:claims_index_status_filter].to_s.split("&")
    end
  end

  def filters
    {}.tap do |filters|
      filters[:user_id] = user_id_filter if user_id_filter.present?
      filters[:status] = status_filter if status_filter.present?
    end
  end

  def update_claim_params
    params.require(:claim).permit(ClaimForm.all_param_names)
  end
end
