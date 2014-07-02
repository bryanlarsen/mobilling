class AddNumberToClaims < ActiveRecord::Migration
  def change
    add_column :claims, :number, :integer
    add_index :claims, [:number, :user_id], unique: true
  end
end
