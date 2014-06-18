class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.integer :user_id
      t.string :file

      t.timestamps
    end
  end
end
