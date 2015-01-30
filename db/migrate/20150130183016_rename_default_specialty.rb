class RenameDefaultSpecialty < ActiveRecord::Migration
  def change
    rename_column :users, :default_template, :default_specialty
  end
end
