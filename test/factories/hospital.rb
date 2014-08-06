FactoryGirl.define do
  factory :hospital do
    sequence(:name) { |n| "Hospital #{n}" }
  end
end
