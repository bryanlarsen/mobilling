FactoryGirl.define do
  factory :service_code do
    sequence(:name) { |n| "Service Code #{n}" }
  end
end
