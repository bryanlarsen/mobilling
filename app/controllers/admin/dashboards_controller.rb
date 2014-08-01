class Admin::DashboardsController < Admin::ApplicationController
  include Sortable

  self.sortable_columns = %w[name saved_count unprocessed_count processed_count rejected_admin_attention_count rejected_doctor_attention_count paid_count]

  def show
    authorize :dashboard, :read?
    # @users = User.accessible_by(current_ability).dashboard.order("#{sort_column} #{sort_direction}")
    @users = ::User.dashboard.order("#{sort_column} #{sort_direction}")
  end
end
