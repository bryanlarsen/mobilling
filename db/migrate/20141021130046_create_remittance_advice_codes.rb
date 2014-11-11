class CreateRemittanceAdviceCodes < ActiveRecord::Migration
  def change
    create_table :remittance_advice_codes do |t|
      t.string :name
      t.string :code

      t.timestamps null: false
    end
  end
end
