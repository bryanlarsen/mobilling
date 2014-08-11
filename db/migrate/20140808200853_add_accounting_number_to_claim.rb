class AddAccountingNumberToClaim < ActiveRecord::Migration
  def change
    add_column :claims, :accounting_number, :string
    add_index  :claims, :accounting_number, unique: true
  end
end

