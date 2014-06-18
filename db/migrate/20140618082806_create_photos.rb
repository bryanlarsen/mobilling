class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos, id: :uuid do |t|
      t.uuid :user_id
      t.string :file

      t.timestamps
    end
  end
end
