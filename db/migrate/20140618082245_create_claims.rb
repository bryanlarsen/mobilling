class CreateClaims < ActiveRecord::Migration
  def change
    create_table :claims do |t|
      t.integer :user_id
      t.integer :photo_id
      t.integer :status
      t.json :details

      t.timestamps
    end
  end
end
