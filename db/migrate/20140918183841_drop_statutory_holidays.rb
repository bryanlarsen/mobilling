class DropStatutoryHolidays < ActiveRecord::Migration
  def change
    drop_table :statutory_holidays
  end
end
