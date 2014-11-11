class AddFeeToServiceCodes < ActiveRecord::Migration
  def change
    add_column :service_codes, :code, :string
    add_index :service_codes, :code, unique: false
    add_column :service_codes, :fee, :decimal, :precision => 11, :scale => 4
    add_column :service_codes, :effective_date, :date
    add_column :service_codes, :termination_date, :date
    add_column :service_codes, :requires_specialist, :boolean, :default => false, :null => false
  end
end
