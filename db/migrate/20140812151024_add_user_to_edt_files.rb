class AddUserToEdtFiles < ActiveRecord::Migration
  def change
    add_column :edt_files, :user_id, :uuid
    add_index :edt_files, :user_id
  end
end
