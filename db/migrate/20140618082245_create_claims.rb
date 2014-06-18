class CreateClaims < ActiveRecord::Migration
  def change
    create_table :claims, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :photo_id
      t.integer :status, default: 0
      t.json :details, default: {}

      t.timestamps
    end
  end
end
