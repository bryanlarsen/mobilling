class AddCountFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :saved_count, :integer, default: 0
    add_column :users, :unprocessed_count, :integer, default: 0
    add_column :users, :processed_count, :integer, default: 0
    add_column :users, :rejected_admin_attention_count, :integer, default: 0
    add_column :users, :rejected_doctor_attention_count, :integer, default: 0
    add_column :users, :paid_count, :integer, default: 0
  end
end
