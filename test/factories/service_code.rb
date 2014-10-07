FactoryGirl.define do
  factory :service_code do
    sequence(:name) { |n| "Service Code #{n}" }
    fee 0
    code "S999A"
    effective_date Date.new(2010,1,1)
    termination_date nil
    requires_specialist false
  end
end
