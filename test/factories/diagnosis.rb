FactoryGirl.define do
  factory :diagnosis do
    sequence(:name) { |n| "Diagnosis #{n}" }
  end
end
