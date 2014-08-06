class CreateClaimComments < ActiveRecord::Migration
  def change
    create_table :claim_comments do |t|
      t.text :body
      t.uuid :user_id
      t.string :user_type
      t.uuid :claim_id
      t.timestamps
    end
  end
end
