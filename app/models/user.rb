class User < ActiveRecord::Base
  SPECIALTIES = %w[internal_medicine family_medicine cardiology anesthesiologist surgical_assist psychotherapist]

  has_secure_password validations: false
  has_many :claims, dependent: :destroy
  has_many :photos, dependent: :destroy
  belongs_to :agent, class_name: "Admin::User"

  def as_json(options = nil)
    attributes.slice(*%w[id name email authentication_token agent_id specialties pin provider_number group_number office_code specialty_code])
  end
end
