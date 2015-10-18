class V1::ItemsController < V1::BaseController
  wrap_parameters Claim::Item

  def show(item = nil, status = 200)
    if item.nil?
      claim = policy_scope(Claim).find(params[:claim_id])
      item = claim.items.find(params[:id])
    end
    authorize item, :show?
    render json: item.as_json, status: status
  end

  def create
    @claim = policy_scope(Claim).find(params[:claim_id])
    authorize @claim, :new_item?
    attrs = item_params
    attrs['day'] ||= Date.today
    attrs['rows_attributes'] ||= attrs['rows'] || [{}]
    @item = @claim.items.build(attrs)
    if @item.save
      show @item, 200
    else
      show @item, 422
    end
  end

  private
  def item_params
    params.require(:item).permit(:day, :time_in, :time_out, :diagnosis, :fee, :paid, :units, :message, :rows)
  end
end
