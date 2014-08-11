class AddSubmissionIdToClaim < ActiveRecord::Migration
  def change
    add_column :claims, :submission_id, :uuid
    add_index :claims, :submission_id, unique: true
  end
end
