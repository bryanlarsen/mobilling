class Admin::DashboardsController < Admin::BaseController
  include Admin::Sortable

  self.sortable_columns = %w[users.name saved_count for_agent_count ready_count file_created_count uploaded_count acknowledged_count agent_attention_count doctor_attention_count paid_count]

  def show
    authorize :dashboard, :read?
    counts = ::Claim.statuses.map { |name, value| "(SELECT COUNT(*) FROM claims WHERE claims.user_id = users.id AND claims.status = #{value}) AS #{name}_count" }
    unread_counts = ::Claim.statuses.map { |name, value| "(SELECT COUNT(DISTINCT claims.id) FROM claims INNER JOIN claim_comments ON claim_comments.claim_id = claims.id AND claim_comments.user_id <> '#{current_user.id}' AND claim_comments.read = 'f' WHERE claims.status = #{value} AND claims.user_id = users.id) AS #{name}_unread_comments" }
    @users = case current_user.role
             when "admin" then @users = ::User.where(role: "doctor")
             when "agent" then @users = ::User.where(agent_id: current_user.id, role: "doctor")
             when "doctor" then @users = ::User.where(id: current_user.id)
             else ::User.none
    end
    @users = @users.select("*").select(counts).select(unread_counts).order("#{sort_column} #{sort_direction}")
  end
end
