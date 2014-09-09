class User < ActiveRecord::Base
  SPECIALTIES = %w[internal_medicine family_medicine cardiology anesthesiologist surgical_assist psychotherapist]

  has_secure_password validations: false
  has_many :claims, dependent: :destroy
  has_many :photos, dependent: :destroy
  belongs_to :agent, class_name: "Admin::User"
end
