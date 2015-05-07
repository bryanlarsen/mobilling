class MigrateIdForClaimComments < ActiveRecord::Migration
  def up
    remove_column :claim_comments, :id
    rename_column :claim_comments, :uuid, :id
    execute "ALTER TABLE claim_comments ADD PRIMARY KEY (id);"
  end
end
