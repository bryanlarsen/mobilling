FactoryGirl.define do
  factory :claim do
    trait :saved do
      status "saved"
    end

    trait :processed do
      status "processed"
    end

    trait :unprocessed do
      status "unprocessed"
    end

    trait :rejected_admin_attention do
      status "rejected_admin_attention"
    end

    trait :rejected_doctor_attention do
      status "rejected_doctor_attention"
    end

    trait :paid do
      status "paid"
    end
  end
end
