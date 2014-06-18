class User < ActiveRecord::Base
  has_secure_password validations: false
  has_many :claims, dependent: :destroy
  has_many :photos, dependent: :destroy
end
