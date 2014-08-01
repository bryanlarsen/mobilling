class Admin::UsersController < Admin::ApplicationController
  include Sortable

  self.sortable_columns = %w[id name email role agents_users.name]

  helper_method :agent_id_filter

  def index
    # @users = User.accessible_by(current_ability).includes(:agent).where(filters).order("#{sort_column} #{sort_direction}")
    @users = User.includes(:agent).where(filters).order("#{sort_column} #{sort_direction}")
    # authorize! :manage, User
  end

  def new
    @user = User.new
    @user.attributes = {agent: current_user, role: "doctor"} if current_user.role.agent?
    authorize! :manage, @user
  end

  def create
    @user = User.new
    @user.attributes = {agent: current_user, role: "doctor"} if current_user.role.agent?
    authorize! :manage, @user
    if @user.update(permitted_params)
      redirect_to admin_users_path
    else
      render "new"
    end
  end

  def edit
    @user = User.find(params[:id])
    authorize! :manage, @user
  end

  def update
    @user = User.find(params[:id])
    authorize! :manage, @user
    if @user.update(permitted_params)
      redirect_to admin_users_path
    else
      render "edit"
    end
  end

  def destroy
    @user = User.find(params[:id])
    authorize! :manage, @user
    @user.destroy
    redirect_to admin_users_path
  end

  private

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
