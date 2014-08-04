class Admin::UsersController < Admin::ApplicationController
  include Admin::Sortable

  self.sortable_columns = %w[users.name users.email users.role admin_users.name]

  helper_method :agent_id_filter

  def index
    @users = policy_scope(:user).where(filters).order("#{sort_column} #{sort_direction}")
    authorize :user, :read?
  end

  def edit
    @interactor = Admin::UpdateUser.new(params[:id])
    authorize :user, :update?
  end

  def update
    @interactor = Admin::UpdateUser.new(params[:id], update_user_params)
    authorize :user, :update?
    if @interactor.perform
      redirect_to admin_users_path
    else
      render "edit"
    end
  end

  def destroy
    @user = ::User.find(params[:id])
    authorize :user, :destroy?
    @user.destroy
    redirect_to admin_users_path
  end

  private

  def create_user_params
    params.require(:admin_create_user).permit(:name, :email, :password, :password_confirmation, :agent_id)
  end

  def update_user_params
    params.require(:admin_update_user).permit(:name, :email, :password, :password_confirmation, :agent_id)
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
