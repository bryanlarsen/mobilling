class Admin::UsersController < Admin::ApplicationController
  include Admin::Sortable

  self.sortable_columns = %w[id name email role agents_users.name]

  helper_method :agent_id_filter

  def index
    # @users = User.accessible_by(current_ability).includes(:agent).where(filters).order("#{sort_column} #{sort_direction}")
    # @users = ::User.includes(:agent).where(filters).order("#{sort_column} #{sort_direction}")
    @users = ::User.order("#{sort_column} #{sort_direction}")
    authorize :user, :read?
  end

  def new
    @interactor = Admin::CreateUser.new
    authorize :user, :create?
  end

  def create
    @interactor = Admin::CreateUser.new(user_params)
    authorize :user, :create?
    if @interactor.perform
      redirect_to admin_users_path
    else
      render "new"
    end
  end

  def edit
    @user = ::User.find(params[:id])
    authorize :user, :update?
  end

  def update
    @user = ::User.find(params[:id])
    authorize :user, :update?
    if @user.update(permitted_params)
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

  def user_params
    params.require(:admin_create_user).permit(:name, :email, :password, :password_confirmation, :agent_id)
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
