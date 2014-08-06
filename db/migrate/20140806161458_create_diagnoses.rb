class CreateDiagnoses < ActiveRecord::Migration
  def change
    create_table :diagnoses, id: :uuid do |t|
      t.string :name
      t.timestamps
    end
    add_index :diagnoses, :name, unique: true
  end
end
