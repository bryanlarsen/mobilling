class V1::CommentsController < V1::BaseController
  wrap_parameters Claim::Comment

  def show(comment = nil, status = 200)
    if comment.nil?
      claim = policy_scope(Claim).find(params[:claim_id])
      comment = claim.comments.find(params[:id])
      authorize claim, :show?
    end
    render json: comment.as_json, status: status
  end

  def create
    @claim = policy_scope(Claim).find(params[:claim_id])
    authorize @claim, :new_comment?
    attrs = comment_params
    attrs['user'] = current_user
    @comment = @claim.comments.build(attrs)
    if @comment.save
      show @comment, 200
    else
      show @comment, 422
    end
  end

  def update
    @claim = policy_scope(Claim).find(params[:claim_id])
    authorize @claim, :update?
    @comment = @claim.comments.find(params[:id])
    if @comment.update_attributes(comment_params)
      show @comment, 200
    else
      show @comment, 422
    end
  end

  private
  def comment_params
    params.require(:comment).permit(:body, :user_id, :claim_id, :read)
  end
end
