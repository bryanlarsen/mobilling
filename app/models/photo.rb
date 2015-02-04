class Photo < ActiveRecord::Base
  mount_uploader :file, PhotoUploader
  belongs_to :user, inverse_of: :photos
  has_one :claim, inverse_of: :photo
end
