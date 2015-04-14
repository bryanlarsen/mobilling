class Admin::ClaimsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = {
    "claims.number" => "claims.number",
    "users.name" => "users.name",
    "claims.status" => "claims.status",
    "claims.patient_name" => "claims.details->>'patient_name'",
    "claims.total_fee" => "claims.total_fee",
    "claims.paid_fee" => "claims.paid_fee",
    "claims.service_date" => "claims.details->'daily_details'->0->>'day'"
  }

  helper_method :user_id_filter, :status_filter

  def index
    @claims = policy_scope(Claim).includes(:files).where(filters).order("#{sort_column} #{sort_direction}")
    @single_status = false
    if params[:status]
      params[:status].delete("")
      @single_status = params[:status].length == 1
    end
    authorize :claim, :create?
  end

  def edit
    @claim = policy_scope(Claim).includes(:comments).includes(:photo).find(params[:id])
    authorize @claim, :update?
    @form = ClaimForm.new(@claim, current_user: current_user)
    @user = current_user
    @stack = policy_scope(Claim).where(filters).order("#{sort_column} #{sort_direction}").select(:id, :user_id).map(&:id)
    render layout: "admin_react"
  end

  def print
    @claims = policy_scope(Claim).includes(:comments).includes(:photo).where(filters).order("#{sort_column} #{sort_direction}")
    @single_status = false
    if params[:status]
      params[:status].delete("")
      @single_status = params[:status].length == 1
    end
    if @claims.length == 0 || !@single_status
      redirect_to admin_claims_path(params.slice(:user_id, :status, :direction, :sort))
      authorize :claim, :create?
      return
    end
    @user = current_user
    @forms = @claims.map { |claim| ClaimForm.new(claim, current_user: current_user) }
    @claims.each do |claim|
      authorize claim, :update?
    end
    render layout: "admin_react"
  end

  def reclaim
    @claim = Claim.find(params[:id])
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
