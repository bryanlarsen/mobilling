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

    flash[:notice] = "Your download should begin immediately.   If it does not please "+view_context.link_to("<i class='fa fa-download'></i> click here.".html_safe, download_admin_edt_file_path(id: @submission, filename: @submission.filename), download: true, "data-no-turbolink" => true) + %Q[<meta http-equiv="refresh" content=".1;url=#{download_admin_edt_file_path(id: @submission, filename: @submission.filename)}"/>]
    redirect_to :back
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
