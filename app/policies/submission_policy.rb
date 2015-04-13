class SubmissionPolicy < Struct.new(:current_user, :submission)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      return ::Submission.none if current_user.blank?
      scope = ::Submission.includes(:user)
      scope = scope.where(users: {agent_id: current_user.id}) if current_user.agent?
      scope
    end
  end

  def access?
    UserPolicy.new(current_user, submission.user).access?
  end

  def read?
    access?
  end

  def update?
    access?
  end
end
