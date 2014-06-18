CarrierWave.configure do |config|
  config.storage = :file
  config.asset_host = ActionController::Base.asset_host
  # config.enable_processing = false if Rails.env.test?
end
