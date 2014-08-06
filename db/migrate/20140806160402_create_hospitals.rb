class CreateHospitals < ActiveRecord::Migration
  def change
    create_table :hospitals do |t|
      t.string :name
      t.timestamps
    end
    add_index :hospitals, :name, unique: true
  end
end
