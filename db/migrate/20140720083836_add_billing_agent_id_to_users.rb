class AddBillingAgentIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :agent_id, :string
    add_index :users, :agent_id
  end
end
