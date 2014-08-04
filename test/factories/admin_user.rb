FactoryGirl.define do
  factory :admin_user, class: Admin::User do
    sequence(:name) { |n| "Admin #{n}" }
    sequence(:email) { |n| "admin#{n}@example.com" }
    password "secret"
  end
end
