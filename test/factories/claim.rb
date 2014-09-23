FactoryGirl.define do
  factory :claim do
    association :user
    status :saved
    sequence(:number)

    ignore do
    	patient_name 'Ruby Larsen, ON 9876543217, 2011-9-19, F'
    	hospital '1681 QCH'
    	diagnosis nil
    	referring_physician nil
    	admission_on nil
    	daily_details []
    end

    details {{ 
    	patient_name: patient_name,
    	hospital: hospital,
    	diagnosis: diagnosis,
    	referring_physician: referring_physician,
    	admission_on: admission_on,
    	daily_details: daily_details,
     }}
  end
end
