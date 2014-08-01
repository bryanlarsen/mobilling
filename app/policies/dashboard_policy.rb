class DashboardPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      counts = Claim.statuses.map { |name, value| "(SELECT COUNT(*) FROM claims WHERE claims.user_id = users.id AND status = #{value}) AS #{name}_count" }
      User.select("*, " + counts.join(", "))
    end
  end

  def read?
    current_user.present?
  end
end
