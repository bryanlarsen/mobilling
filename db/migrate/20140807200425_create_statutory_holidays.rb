class CreateStatutoryHolidays < ActiveRecord::Migration
  def change
    create_table :statutory_holidays do |t|
      t.date :day

      t.timestamps
    end

    add_index :statutory_holidays, :day, unique: true
  end
end
