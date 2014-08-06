FactoryGirl.define do
  factory :claim_comment, class: Claim::Comment do
    association :user
    association :claim
    body "You're doing it WRONG!"
  end
end
