FactoryGirl.define do
  factory :user do
    sequence(:name) { |n| "User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password "secret"
    specialties ["internal_medicine"]
    association :agent, factory: :admin_user, role: "agent"

    trait :authenticated do
      authentication_token SecureRandom.hex(32)
    end
  end
end
