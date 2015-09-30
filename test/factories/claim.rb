FactoryGirl.define do
  factory :claim do
    association :user
    status :saved
    sequence(:number)

    specialty 'internal_medicine'
    patient_name 'Ruby Larsen'
    patient_number '9876543217'
    patient_province 'ON'
    patient_birthday '2011-9-19'
    patient_sex 'F'
    hospital '1681 QCH'
    diagnoses []
    admission_on nil
  end
end
