class FixFilenameIndex < ActiveRecord::Migration
  def change
    remove_index :edt_files, column: [:filename_base, :sequence_number], unique: true
    add_index :edt_files, [:user_id, :filename_base, :sequence_number], unique: true, name: "index_edt_files_on_filename"

    # remove unique:true
    remove_index :claims, column: :submission_id, unique: true
    add_index :claims, :submission_id
  end
end
