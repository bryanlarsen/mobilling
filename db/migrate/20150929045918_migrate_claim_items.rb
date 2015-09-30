class MigrateClaimItems < ActiveRecord::Migration
  def up
    Claim.find_each do |claim|
      claim.details['daily_details'].each.with_index do |item, i|
        ci = Claim::Item.new do |ci|
          ci.claim_id = claim.id
          ci.id = item['uuid']
          ci.day = item['day']
          ci.time_in = item['time_in']
          ci.time_out = item['time_out']
          ci.diagnosis = item['diagnosis']
        end
        ci.save!
        cir0 = Claim::Row.new do |cir|
          cir.item_id = ci.id
          cir.code = item['code']
          cir.fee = item['fee']
          cir.paid = item['paid']
          cir.units = item['units']
          cir.message = item['message']
        end
        cir0.save!
        item['premiums'].each do |prem|
          Claim::Row.new do |cir|
            cir.item_id = ci.id
            cir.id = prem['uuid']
            cir.code = prem['code']
            cir.fee = prem['fee']
            cir.paid = prem['paid']
            cir.units = prem['units']
            cir.message = prem['message']
          end.save!
        end
        ci.save!
      end
    end
  end

  def down
  end
end
