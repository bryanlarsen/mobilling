class MigrateClaims < ActiveRecord::Migration
  def up
    Claim.find_each do |claim|
      claim.specialty = claim.details['specialty']
      claim.patient_name = claim.details['patient_name']
      claim.patient_number = claim.details['patient_number']
      claim.patient_province = claim.details['patient_province']
      claim.patient_birthday = claim.details['patient_birthday']
      claim.patient_sex = claim.details['patient_sex']
      claim.hospital = claim.details['hospital']
      claim.referring_physician = claim.details['referring_physician']
      claim.most_responsible_physician = claim.details['most_responsible_physician']
      claim.admission_on = claim.details['admission_on']
      claim.first_seen_on = claim.details['first_seen_on']
      claim.first_seen_consult = claim.details['first_seen_consult']
      claim.last_seen_on = claim.details['last_seen_on']
      claim.last_seen_discharge = claim.details['last_seen_discharge']
      claim.icu_transfer = claim.details['icu_transfer']
      claim.consult_type = claim.details['consult_type']
      claim.consult_time_in = claim.details['consult_time_in']
      claim.consult_time_out = claim.details['consult_time_out']
      claim.consult_premium_visit = claim.details['consult_premium_visit']
      claim.consult_premium_first = claim.details['consult_premium_first']
      claim.consult_premium_travel = claim.details['consult_premium_travel']
      claim.referring_laboratory = claim.details['referring_laboratory']
      claim.payment_program = claim.details['payment_program']
      claim.payee = claim.details['payee']
      claim.manual_review_indicator = claim.details['manual_review_indicator']
      claim.service_location = claim.details['service_location']
      claim.last_code_generation = claim.details['last_code_generation']
      claim.diagnoses = claim.details['diagnoses']
      claim.save!
    end
  end
end
