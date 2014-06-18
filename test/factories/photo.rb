FactoryGirl.define do
  factory :photo do
    file { Rack::Test::UploadedFile.new(Rails.root.join("test", "fixtures", "image.png")) }
  end
end
