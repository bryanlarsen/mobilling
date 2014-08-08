FactoryGirl.define do
  factory :claim do
    association :user

    ignore do
    	hospital '1681 QCH'
    	diagnosis nil
    	daily_details []
    end

    details {{ 
    	hospital: hospital,
    	diagnosis: diagnosis,
    	daily_details: daily_details,
     }}
  end
end
