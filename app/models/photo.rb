class Photo < ActiveRecord::Base
  mount_uploader :file, PhotoUploader
  belongs_to :user
  has_one :claim
end
