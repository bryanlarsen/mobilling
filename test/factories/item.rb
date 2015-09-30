FactoryGirl.define do
  factory :item, class: Claim::Item do
    association :claim
  end
end
