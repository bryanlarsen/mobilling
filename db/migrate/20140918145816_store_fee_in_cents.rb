class StoreFeeInCents < ActiveRecord::Migration
  def up
    change_column :service_codes, :fee, :integer
  end

  def down
    change_column :service_codes, :fee, :decimal, :precision => 11, :scale => 4
  end
end
