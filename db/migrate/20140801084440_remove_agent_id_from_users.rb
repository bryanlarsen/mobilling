class RemoveAgentIdFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :agent_id, :string
  end
end
