class ClaimPolicy < Struct.new(:current_user, :user)
  class Scope < Struct.new(:current_user, :scope)
    def resolve
      Claim.joins(:user)
        .select("*")
        .select("users.name as doctor_name")
        .select("details->>'patient_name' as patient_name")
    end
  end

  def read?
    current_user.present?
  end

  def update?
    current_user.present?
  end
end
