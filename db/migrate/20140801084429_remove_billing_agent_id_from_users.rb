class RemoveBillingAgentIdFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :billing_agent_id, :integer
  end
end
