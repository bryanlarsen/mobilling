class Admin::DashboardsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[users.name saved_count unprocessed_count processed_count rejected_admin_attention_count rejected_doctor_attention_count paid_count]

  def show
    authorize :dashboard, :read?
    @users = policy_scope(:dashboard).order("#{sort_column} #{sort_direction}")
  end
end
