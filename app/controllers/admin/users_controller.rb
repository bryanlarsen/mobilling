class Admin::UsersController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[users.name users.email users.role]

  helper_method :agent_id_filter

  def new
    @user = User.new
    render layout: "admin_react"
  end

  def index
    @users = policy_scope(:user).where(filters).order("#{sort_column} #{sort_direction}")
    authorize :user, :read?
  end

  def edit
    @user = policy_scope(:user).find(params[:id])
    @interactor = UpdateUser.new(@user)
    authorize :user, :update?
  end

  def update
    @user = policy_scope(:user).find(params[:id])
    @interactor = UpdateUser.new(@user, update_user_params)
    authorize :user, :update?
    if @interactor.perform
      redirect_to admin_users_path
    else
      render "edit"
    end
  end

  def destroy
    @user = policy_scope(:user).find(params[:id])
    authorize :user, :destroy?
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
