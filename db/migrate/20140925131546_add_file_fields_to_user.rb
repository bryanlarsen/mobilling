class AddFileFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :provider_number, :integer
    add_column :users, :group_number, :string, limit: 4, default: '0000'
    add_column :users, :office_code, :string, limit: 1
    add_column :users, :specialty_code, :integer
  end
end
