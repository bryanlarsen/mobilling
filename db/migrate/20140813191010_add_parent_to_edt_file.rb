class AddParentToEdtFile < ActiveRecord::Migration
  def change
    add_column :edt_files, :parent_id, :uuid
    add_column :claims, :batch_acknowledgment_id, :uuid
    add_column :claims, :remittance_advice_id, :uuid
    add_column :claims, :error_report_id, :uuid
  end
end
