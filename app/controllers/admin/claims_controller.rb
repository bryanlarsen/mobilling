class Admin::ClaimsController < Admin::ApplicationController
  include Sortable

  self.sortable_columns = %w[id backend_number users.name state submitted_date patient_name]

  helper_method :user_id_filter, :state_filter

  def index
    @claims = Claim.accessible_by(current_ability).includes(:user).where(filters).order("#{sort_column} #{sort_direction}")
    authorize! :manage, Claim
  end

  def edit
    @claim = Claim.find(params[:id])
    authorize! :manage, @claim
  end

  def update
    @claim = Claim.find(params[:id])
    authorize! :manage, @claim

    @claim.attributes = claim_params
    emails = @claim.comments.reject(&:persisted?).map do |comment|
      comment.user = current_user
      UserMailer.claim_commented(@claim.user, @claim, comment)
    end

    if @claim.save
      emails.each(&:deliver)
      redirect_to admin_claims_path, notice: "Claim updated successfully."
    else
      flash.now[:error] = "Unable to save the record."
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

  def state_filter
    if params.key?(:state)
      cookies[:claims_index_state_filter] = Array.wrap(params[:state]).select(&:present?)
    else
      cookies[:claims_index_state_filter].to_s.split("&")
    end
  end

  def filters
    {}.tap do |filters|
      filters[:user_id] = user_id_filter if user_id_filter.present?
      filters[:state] = state_filter if state_filter.present?
    end
  end

  def claim_params
    params.require(:claim).permit(:patient_name, :backend_number, :state, :value, comments_attributes: [:body])
  end
end
