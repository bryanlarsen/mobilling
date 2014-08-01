class User < ActiveRecord::Base
  has_secure_password validations: false
  has_many :claims, dependent: :destroy
  has_many :photos, dependent: :destroy
  belongs_to :agent, class_name: "User"

  def self.dashboard
    counts = Claim.statuses.map { |name, value| "(SELECT COUNT(*) FROM claims WHERE claims.user_id = users.id AND status = #{value}) AS #{name}_count" }
    select("*, " + counts.join(", "))
  end
end
