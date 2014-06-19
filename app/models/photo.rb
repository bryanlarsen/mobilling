class Photo < ActiveRecord::Base
  mount_uploader :file, PhotoUploader
  belongs_to :user
end
