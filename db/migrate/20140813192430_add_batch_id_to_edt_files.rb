class AddBatchIdToEdtFiles < ActiveRecord::Migration
  def change
    add_column :edt_files, :batch_id, :string
    add_index :edt_files, [:user_id, :batch_id], unique: true
  end
end
