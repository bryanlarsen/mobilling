class Admin::ClaimsController < Admin::ApplicationController
  include Admin::Sortable

  self.sortable_columns = %w[number doctor_name patient_name]

  helper_method :user_id_filter, :status_filter

  def index
    @claims = policy_scope(:claim).where(filters).order("#{sort_column} #{sort_direction}")
    authorize :claim, :read?
  end

  def edit
    @interactor = Admin::UpdateClaim.new(params[:id])
    authorize :claim, :update?
  end

  def update
    @interactor = Admin::UpdateClaim.new(params[:id], update_claim_params)
    authorize :claim, :update?

    if @interactor.perform
      redirect_to admin_claims_path, notice: "Claim updated successfully."
    else
      render :edit
    end
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
    params.require(:claim).permit(:patient_name, :status)
  end
end
