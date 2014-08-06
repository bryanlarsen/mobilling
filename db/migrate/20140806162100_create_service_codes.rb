class CreateServiceCodes < ActiveRecord::Migration
  def change
    create_table :service_codes do |t|
      t.text :name
      t.timestamps
    end
    add_index :service_codes, :name, unique: true
  end
end
