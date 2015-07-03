FactoryGirl.define do
  factory :agent, class: User do
    sequence(:name) { |n| "Agent #{n}" }
    sequence(:email) { |n| "agent#{n}@example.com" }
    password "secret"
    role "agent"
    authentication_token { SecureRandom.hex(32) }
    token_at DateTime.now
  end

  factory :user do
    association :agent
    sequence(:name) { |n| "User #{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password "secret"
    role "doctor"
    default_specialty "internal_medicine"
    sequence(:provider_number, 100)
    specialty_code 0
    group_number "0000"
    office_code "D"

    authentication_token { SecureRandom.hex(32) }
    token_at DateTime.now
  end
end
