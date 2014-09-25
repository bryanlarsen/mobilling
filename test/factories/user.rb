FactoryGirl.define do
  factory :user do
    sequence(:name) { |n| "User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password "secret"
    specialties ["internal_medicine"]
    association :agent, factory: :admin_user, role: "agent"
    provider_number 0
    specialty_code 0
    group_number "0000"
    office_code "D"

    trait :authenticated do
      authentication_token SecureRandom.hex(32)
    end
  end
end
