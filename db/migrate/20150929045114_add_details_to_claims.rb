



class AddDetailsToClaims < ActiveRecord::Migration
  def change
    add_column :claims, :specialty, :string, null: false, default: 'family_medicine'
    add_column :claims, :patient_name, :string, null: false, default: ''
    add_column :claims, :patient_number, :string, null: false, default: ''
    add_column :claims, :patient_province, :string, null: false, default: 'ON'
    add_column :claims, :patient_birthday, :date
    add_column :claims, :patient_sex, :string, null: false, default: 'F'
    add_column :claims, :hospital, :string
    add_column :claims, :referring_physician, :string
    add_column :claims, :most_responsible_physician, :bool, null: false, default: false
    add_column :claims, :admission_on, :date
    add_column :claims, :first_seen_on, :date
    add_column :claims, :first_seen_consult, :boolean, null: false, default: false
    add_column :claims, :last_seen_on, :date
    add_column :claims, :last_seen_discharge, :boolean, null: false, default: false
    add_column :claims, :icu_transfer, :boolean, null: false, default: false
    add_column :claims, :consult_type, :string
    add_column :claims, :consult_time_in, :string
    add_column :claims, :consult_time_out, :string
    add_column :claims, :consult_premium_visit, :string
    add_column :claims, :consult_premium_first, :boolean, null: false, default: false
    add_column :claims, :consult_premium_travel, :boolean, null: false, default: false
    add_column :claims, :referring_laboratory, :string
    add_column :claims, :payment_program, :string
    add_column :claims, :payee, :string
    add_column :claims, :manual_review_indicator, :boolean, null: false, default: false
    add_column :claims, :service_location, :string
    add_column :claims, :last_code_generation, :string
    add_column :claims, :diagnoses, :jsonb, null: false, default: '[]'
    remove_column :claims, :total_fee, :integer
  end
end
