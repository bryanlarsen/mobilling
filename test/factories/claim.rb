FactoryGirl.define do
  factory :claim do
    association :user
    status :saved
    sequence(:number)

    ignore do
        patient_name 'Ruby Larsen'
        patient_number '9876543217'
        patient_province 'ON'
        patient_birthday '2011-9-19'
        patient_sex 'F'
    	hospital '1681 QCH'
    	diagnosis nil
    	referring_physician nil
    	admission_on nil
    	daily_details []
    end

    details {{
    	patient_name: patient_name,
        patient_number: patient_number,
        patient_province: patient_province,
        patient_birthday: patient_birthday,
        patient_sex: patient_sex,
    	hospital: hospital,
    	diagnosis: diagnosis,
    	referring_physician: referring_physician,
    	admission_on: admission_on,
    	daily_details: daily_details,
     }}
  end
end
