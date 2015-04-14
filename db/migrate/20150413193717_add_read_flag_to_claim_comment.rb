class AddReadFlagToClaimComment < ActiveRecord::Migration
  def change
    add_column :claim_comments, :read, :boolean, default: false
  end
end
