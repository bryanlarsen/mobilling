class CreateErrorReportExplanatoryCodes < ActiveRecord::Migration
  def change
    create_table :error_report_explanatory_codes do |t|
      t.string :name
      t.string :code

      t.timestamps null: false
    end
  end
end
