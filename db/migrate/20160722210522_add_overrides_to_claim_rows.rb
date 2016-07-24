class AddOverridesToClaimRows < ActiveRecord::Migration
  def change
    add_column :claim_rows, :override_fee, :boolean, null: false, default: false
    add_column :claim_rows, :override_units, :boolean, null: false, default: false
  end
end
