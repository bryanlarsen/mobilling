class ClaimPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      ::Claim.includes(:user)
    end
  end

  def read?
    current_user.present?
  end

  def update?
    current_user.present?
  end
end
