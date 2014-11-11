class AddOriginalIdToClaim < ActiveRecord::Migration
  def change
    add_column :claims, :original_id, :uuid
  end
end
