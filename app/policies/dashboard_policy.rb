class DashboardPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      counts = ::Claim.statuses.map { |name, value| "(SELECT COUNT(*) FROM claims WHERE claims.user_id = users.id AND claims.status = #{value}) AS #{name}_count" }
      scope = ::User.joins(%Q{LEFT OUTER JOIN "admin_users" ON "admin_users"."id" = "users"."agent_id"}).select("users.*").select(counts)
      scope = scope.where(admin_users: {id: current_user.id}) if current_user.agent?
      scope
    end
  end

  def read?
    current_user.present?
  end
end
