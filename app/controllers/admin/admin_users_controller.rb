class Admin::AdminUsersController < Admin::ApplicationController
  include Admin::Sortable

  self.sortable_columns = %w[admin_users.name admin_users.email admin_users.role]

  def index
    @admin_users = policy_scope(:admin_user).order("#{sort_column} #{sort_direction}")
    authorize :admin_user, :read?
  end

  def new
    @interactor = ::Admin::CreateAdminUser.new
    authorize :admin_user, :create?
  end

  def create
    @interactor = ::Admin::CreateAdminUser.new(admin_create_admin_user_params)
    authorize :admin_user, :create?
    if @interactor.perform
      redirect_to admin_admin_users_path
    else
      render :new
    end
  end

  def edit
    @admin_user = policy_scope(:admin_user).find(params[:id])
    @interactor = ::Admin::UpdateAdminUser.new(@admin_user)
    authorize :admin_user, :update?
  end

  def update
    @admin_user = policy_scope(:admin_user).find(params[:id])
    @interactor = ::Admin::UpdateAdminUser.new(@admin_user, admin_update_admin_user_params)
    authorize :admin_user, :update?
    if @interactor.perform
      redirect_to admin_admin_users_path
    else
      render :edit
    end
  end

  def destroy
    @admin_user = policy_scope(:admin_user).find(params[:id])
    authorize :admin_user, :destroy?
    @admin_user.destroy
    redirect_to admin_admin_users_path
  end

  private

  def admin_create_admin_user_params
    params.require(:admin_create_admin_user).permit(:name, :email, :password, :password_confirmation, :role)
  end

  def admin_update_admin_user_params
    params.require(:admin_update_admin_user).permit(:name, :email, :password, :password_confirmation, :role)
  end
end
