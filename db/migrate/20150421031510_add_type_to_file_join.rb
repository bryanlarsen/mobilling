class AddTypeToFileJoin < ActiveRecord::Migration
  def change
    add_column :claim_files, :type, :string

    ClaimFile.reset_column_information
    ClaimFile.includes(:edt_file).find_each do |cf|
      if cf.edt_file
        cf.type = cf.edt_file.type
        cf.save!
      end
    end
  end
end
