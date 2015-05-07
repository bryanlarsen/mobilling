class AddUuidToClaimComments < ActiveRecord::Migration
  def change
    add_column :claim_comments, :uuid, :uuid, default: 'uuid_generate_v4()', null: false
  end
end
