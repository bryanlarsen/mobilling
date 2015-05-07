class AddUuidToClaimFiles < ActiveRecord::Migration
  def up
    add_column :claim_files, :uuid, :uuid, default: 'uuid_generate_v4()', null: false
    remove_column :claim_files, :id
    rename_column :claim_files, :uuid, :id
    execute "ALTER TABLE claim_files ADD PRIMARY KEY (id);"
   end
end
