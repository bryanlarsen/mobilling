class Admin::SubmissionsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[edt_files.filename]

  def index
    @user = policy_scope(:user).find(params[:user_id])
    @submissions = policy_scope(:submission).where(user_id: @user.id).includes(:claims)
    if sort_column == "edt_files.filename"
      @submissions = @submissions.order("edt_files.filename_base #{sort_direction}, edt_files.sequence_number #{sort_direction}")
    else
      @submissions = @submissions.order("#{sort_column} #{sort_direction}")
    end
    authorize :submission, :read?
  end

  def create
    @user = policy_scope(:user).find(params[:user_id])
    @submission = ::Submission.generate(@user)
    @submission.save!
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