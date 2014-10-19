class Admin::SubmissionsController < Admin::BaseController
  def create
    @user = policy_scope(:user).find(params[:user_id])
    @claims = @user.claims.ready.where(submission_id: nil)

    if @claims.length === 0
      flash[:notice] = "no claims to process"
      return redirect_to "#{admin_claims_path(user_id: @user, status: [Claim.statuses['ready']])}"
    end

    @interactor = GenerateSubmission.new
    @interactor.perform(@user, @claims)
    if @interactor.errors.length > 0
      flash[:error] = @interactor.errors.to_yaml
      return redirect_to "#{admin_claims_path(user_id: @user, status: [Claim.statuses['ready']])}"
    end

    @submission = ::Submission.new(@interactor.attributes)
    ActiveRecord::Base.transaction do
      @submission.save!
      @claims.update_all(status: Claim.statuses["uploaded"])
    end
    redirect_to "#{admin_user_submission_path(id: @submission, user_id: @user)}/#{@submission.filename}"
  end

  def show
    @user = policy_scope(:user).find(params[:user_id])
    @submission = policy_scope(:submission).find(params[:id])
    send_data @submission.contents, filename: @submission.filename, disposition: 'attachment', type: 'text/plain'
  end

  def download
    byebug
  end
end
