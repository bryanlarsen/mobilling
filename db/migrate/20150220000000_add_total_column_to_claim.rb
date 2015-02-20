class AddTotalColumnToClaim < ActiveRecord::Migration
  def up
    add_column :claims, :total_fee, :integer, default: 0

    Claim.reset_column_information
    Claim.find_each do |claim|
      claim.total_fee = claim.details['daily_details'].reduce(0) do |sum, dets|
        sum += (dets['fee'] || 0) + (dets['premiums'] || []).reduce(0) do |sum2, prem|
          sum2 += (prem['fee'] || 0)
        end
      end
      claim.save!
    end
  end

  def down
    remove_column :claims, :total_fee, :integer
  end
end
