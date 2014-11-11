class Admin::DashboardsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[users.name saved_count for_agent_count ready_count file_created_count uploaded_count acknowledged_count agent_attention_count doctor_attention_count paid_count]

  def show
    authorize :dashboard, :read?
    @users = policy_scope(:dashboard).order("#{sort_column} #{sort_direction}")
  end
end
