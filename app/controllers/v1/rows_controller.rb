class V1::RowsController < V1::BaseController
  wrap_parameters Claim::Row

  def show(row = nil, status = 200)
    if row.nil?
      claim = policy_scope(Claim).find(params[:claim_id])
      row = claim.rows.find(params[:id])
    end
    authorize row, :show?
    render json: row.as_json, status: status
  end

  def create
    @claim = policy_scope(Claim).find(params[:claim_id])
    authorize @claim, :new_item?
    @item = @claim.items.find(params[:item_id])
    attrs = row_params rescue {}
    @row = @item.rows.build(attrs)
    if @row.save
      show @row, 200
    else
      show @row, 422
    end
  end

  def update
    @claim = policy_scope(Claim).find(params[:claim_id])
    authorize @claim, :update?
    @row = @claim.rows.find(params[:id])
    if @row.update_attributes(row_params)
      show @row, 200
    else
      show @row, 422
    end
  end

  def destroy
    @claim = policy_scope(Claim).find(params[:claim_id])
    authorize @claim, :destroy?
    @row = @claim.rows.find(params[:id])
    @row.destroy
    show @row
  end

  private
  def row_params
    params.require(:row).permit(:code, :fee, :paid, :units, :message)
  end
end
