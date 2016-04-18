class AddFeeColumnsToClaim < ActiveRecord::Migration
  class Claim < ActiveRecord::Base
  end

  def up
    add_column :claims, :submitted_fee, :integer, default: 0
    add_column :claims, :paid_fee, :integer, default: 0

    # Claim.reset_column_information
    # Claim.find_each do |claim|
    #   claim.submitted_fee = claim.submitted_details['items'].reduce(0) do |sum, dets|
    #     sum += dets['Fee Submitted'] + dets['premiums'].reduce(0) do |sum2, prem|
    #       sum2 += prem['Fee Submitted']
    #     end
    #   end

    #   if claim.remittance_details.nil?
    #     claim.paid_fee = 0
    #   else
    #     claim.paid_fee = claim.remittance_details['items'].reduce(0) do |sum, dets|
    #       sum += dets['Amount Paid'] + dets['premiums'].reduce(0) do |sum2, prem|
    #         sum2 += prem['Amount Paid']
    #       end
    #     end
    #   end
    #   claim.save!
    # end
  end

  def down
    remove_column :claims, :submitted_fee, :integer
    remove_column :claims, :paid_fee, :integer
  end
end
