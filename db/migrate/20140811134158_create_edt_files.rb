class CreateEdtFiles < ActiveRecord::Migration
  def change
    create_table :edt_files, id: :uuid do |t|
      t.integer :status, default: 0
      t.string :filename
      t.text :contents
      t.string :type

      t.timestamps
    end
  end
end
