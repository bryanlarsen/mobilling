class Admin::UsersController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[users.name users.email users.role]

  helper_method :agent_id_filter

  def new
    @user = ::User.new({
                         group_number: '0000',
                         office_code: 'F',
                         specialty_code: 0,
                         default_specialty: 'family_medicine'
                       })
    authorize @user
    render layout: "admin_react"
  end

  def index
    authorize :public, :logged_in?
    @users = policy_scope(User).where(filters).order("#{sort_column} #{sort_direction}")
  end

  def edit
    @user = User.find(params[:id])
    authorize @user, :update?
    render layout: "admin_react"
  end

  def destroy
    @user = User.find(params[:id])
    authorize @user, :destroy?
    @user.destroy
    redirect_to admin_users_path
  end

  private

  def update_user_params
    params.require(:update_user).permit(:name, :email, :password, :agent_id)
  end

  def agent_id_filter
    if params.key?(:agent_id)
      cookies[:users_index_agent_id_filter] = params[:agent_id]
    else
      cookies[:users_index_agent_id_filter]
    end
  end

  def filters
    {}.tap do |filters|
      filters[:agent_id] = agent_id_filter if agent_id_filter.present?
    end
  end
end
