class CreatePhoto
  include ActiveModel::Model

  attr_accessor :user, :file
  attr_reader :photo

  validates :user, presence: true
  validates :file, presence: true

  def perform
    return false if invalid?
    @photo = Photo.new(user: user, file: file)
    @photo.save!
  end
end
