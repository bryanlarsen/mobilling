class AddAgentIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :agent_id, :uuid
  end
end
