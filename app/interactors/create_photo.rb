class CreatePhoto
  include ActiveModel::Model

  attr_accessor :user, :file
  attr_reader :photo

  validates :user, presence: true
  validates :file, presence: true

  def initialize(attributes = nil)
    @photo = Photo.new
    super
  end

  def perform
    return false if invalid?
    @photo.update!(user: user, file: file)
  end
end
