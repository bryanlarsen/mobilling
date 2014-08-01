class Admin::ClaimsController < Admin::ApplicationController
  include Admin::Sortable

  self.sortable_columns = %w[id users.name status patient_name]

  helper_method :user_id_filter, :status_filter

  def index
    @claims = Claim.includes(:user).where(filters).order("#{sort_column} #{sort_direction}")
    authorize :claim, :read?
  end

  def edit
    @claim = Claim.find(params[:id])
    authorize :claim, :update?
  end

  def update
    @claim = Claim.find(params[:id])
    authorize :claim, :update?

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

  def claim_params
    params.require(:claim).permit(:patient_name, :status, :value, comments_attributes: [:body])
  end
end
