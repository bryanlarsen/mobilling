class Admin::DashboardsController < Admin::ApplicationController
  include Sortable

  self.sortable_columns = User::Dashboard::SORTABLE_COLUMNS

  def show
    authorize! :read, :dashboard
    @users = User.accessible_by(current_ability).dashboard.order("#{sort_column} #{sort_direction}")
  end
end
