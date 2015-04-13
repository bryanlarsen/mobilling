class Admin::SubmissionsController < Admin::BaseController
  def create
    authorize :edt_file
    @user = User.find(params[:user_id])
    @claims = @user.claims.ready

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
      @submission.claims.each do |claim|
        claim.save!
      end
    end

    # see _flash.html.erb for !!
    flash[:notice] = "!!" + download_admin_edt_file_path(id: @submission, filename: @submission.filename)
    redirect_to admin_edt_file_path(@submission)
  end

  def update
    @submission = Submission.find(params[:id])
    authorize @submission, :update?
    @submission.status = params[:status]
    @submission.save!
    redirect_to admin_edt_file_path(@submission)
  end
end
