class AddTypeToFileJoin < ActiveRecord::Migration
  class Claim < ActiveRecord::Base ; end
  class EdtFile < ActiveRecord::Base ; end
  class ClaimFile < ActiveRecord::Base
    belongs_to :edt_file
  end

  def up
    add_column :claim_files, :edt_file_type, :string

    ClaimFile.reset_column_information
    ClaimFile.includes(:edt_file).find_each do |cf|
      if cf.edt_file
        cf.edt_file_type = cf.edt_file.type
        cf.save!
      end
    end
    #remove_column :edt_files, :type, :string
  end

  def down
    # add_column :edt_files, :type, :string
    # EdtFile.reset_column_information
    # ClaimFile.includes(:edt_file).find_each do |cf|
    #   if cf.edt_file
    #     cf.edt_file.type = cf.edt_file_type
    #     cf.edt_file.save!
    #   end
    # end
    remove_column :claim_files, :edt_file_type, :string
  end
end
