class User < ActiveRecord::Base
  include Roles

  has_secure_password validations: false
  has_many :claims, dependent: :destroy
  has_many :photos, dependent: :destroy
  belongs_to :agent, class_name: "User"

  CLAIM_COUNT_FIELDS = %i[saved_count unprocessed_count processed_count rejected_admin_attention_count rejected_doctor_attention_count paid_count]

  after_touch :update_claim_counts

private

  def update_claim_counts
    CLAIM_COUNT_FIELDS.each do |field|
      self[field] = 0
    end
    claims.each do |claim|
      self["#{claim.status}_count"] += 1
    end
    self.save!
  end

end
