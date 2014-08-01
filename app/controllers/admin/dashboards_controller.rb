class Admin::DashboardsController < Admin::ApplicationController
  include Sortable

  self.sortable_columns = ["name"] # User::Dashboard::SORTABLE_COLUMNS

  def show
    authorize :dashboard, :read?
    # @users = User.accessible_by(current_ability).dashboard.order("#{sort_column} #{sort_direction}")
    @users = ::User.all
  end
end
