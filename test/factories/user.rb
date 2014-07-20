FactoryGirl.define do
  factory :user do
    sequence(:name) { |n| "User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password "secret"
    role "doctor"
    agent_id nil

    trait :authenticated do
      authentication_token SecureRandom.hex(32)
    end
  end
end
