class AddTokenAtToUsers < ActiveRecord::Migration
  def change
    add_column :users, :token_at, :datetime
  end
end
