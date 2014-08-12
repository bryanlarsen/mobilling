class AddSequenceNumberToEdtFiles < ActiveRecord::Migration
  def change
    add_column :edt_files, :sequence_number, :integer
    add_column :edt_files, :filename_base, :string
    remove_column :edt_files, :filename
    add_index :edt_files, :filename_base, unique: false
    add_index :edt_files, [:filename_base, :sequence_number], unique: true
  end
end
