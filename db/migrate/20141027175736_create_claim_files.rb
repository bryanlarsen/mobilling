class CreateClaimFiles < ActiveRecord::Migration
  def change
    create_table :claim_files do |t|
      t.uuid :claim_id
      t.uuid :edt_file_id

      t.timestamps null: false
    end

    remove_column :claims, :submission_id, :uuid
    remove_column :claims, :batch_acknowledgment_id, :uuid
    remove_column :claims, :remittance_advice_id, :uuid
    remove_column :claims, :error_report_id, :uuid
  end
end
