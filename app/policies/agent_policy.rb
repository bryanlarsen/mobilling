class AgentPolicy < PublicPolicy
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      User.agent.all
    end
  end
end
