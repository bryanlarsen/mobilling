class CreateClaimItems < ActiveRecord::Migration
  def change
    create_table :claim_items, id: :uuid do |t|
      t.uuid :claim_id, null: false, index: true
      t.date :day, null: false
      t.string :diagnosis, null: false, default: ""
      t.string :time_in
      t.string :time_out
      t.timestamps
    end

    create_table :claim_rows, id: :uuid do |t|
      t.uuid :item_id, null: false, index: true
      t.string :code, null: false, default: ""
      t.integer :fee
      t.integer :paid
      t.integer :units
      t.string :message
      t.timestamps
      t.index [:item_id, :fee]
    end
  end
end
