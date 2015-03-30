class AddDiagnosticCodeToServiceCode < ActiveRecord::Migration
  def change
    add_column :service_codes, :requires_diagnostic_code, :boolean, :default => false, :null => false
   end
end
