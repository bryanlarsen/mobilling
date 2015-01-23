class RenameDefaultTemplate < ActiveRecord::Migration
  def change
    rename_column :users, :default_specialty, :default_template
  end
end
