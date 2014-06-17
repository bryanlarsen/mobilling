Apipie.configure do |config|
  config.app_name                = "Mo-Billing"
  config.app_info                = ""
  config.api_base_url            = ""
  config.doc_base_url            = "/docs"
  config.api_controllers_matcher = "#{Rails.root}/app/controllers/**/*.rb"
  config.validate                = false
  config.show_all_examples       = true
end
