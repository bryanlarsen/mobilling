class ClaimNewStatuses < ActiveRecord::Migration
  class Claim < ActiveRecord::Base
  end

  def change
    Claim.reset_column_information
    reversible do |dir|
      dir.up do
        Claim.all.each do |claim|
          if claim.status > 2
            claim.status = claim.status + 3
            claim.save!
          end
        end
      end
    end
  end
end
