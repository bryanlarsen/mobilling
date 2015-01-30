class Admin::ClaimsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[claims.number users.name claims.status claims.details->>'patient_name']

  helper_method :user_id_filter, :status_filter

  def index
    @claims = policy_scope(Claim).where(filters).order("#{sort_column} #{sort_direction}")
    authorize :claim, :create?
  end

  def edit
    @claim = policy_scope(Claim).includes(:comments).includes(:photo).find(params[:id])
    authorize @claim, :update?
    @form = ClaimForm.new(@claim)
    @user = current_user
    render layout: "admin_react"
  end

  def reclaim
    @claim = policy_scope(:claim).find(params[:id])
    authorize @claim, :update?
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
