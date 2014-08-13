require "#{Rails.root}/lib/record_builder.rb"

class Submission < EdtFile
  has_many :claims

  def self.generate(user, timestamp=nil)
    # assumptions
    provider = 18468
    group_number = '0000'
    office_code = 'D'
    specialty = 0

    claims = user.claims.unprocessed.where(submission_id: nil)
    submission = self.new(user: user, claims: claims)
    timestamp = DateTime.now if timestamp.nil?

    r=BatchHeaderRecord.new
    r['Batch Creation Date']=timestamp.to_date
    r['Batch Identification Number']=timestamp.strftime("%H%M")
    r['Group Number']=group_number
    r['Health Care Provider']=provider
    r['MOH Office Code']=office_code
    r['Specialty']=specialty
    submission.contents = r.to_s

    num_records = 0
    claims.each do |claim|
      submission.contents += claim.to_record
      num_records += claim.num_records
    end

    tr = BatchTrailerRecord.new
    tr.set_field!('H Count', claims.length)
    tr.set_field!('T Count', num_records)
    submission.contents += tr.to_s

    submission.generate_filename('H', user, provider, timestamp)

    submission
  end

  def claim_records(claim)
    records = []
    in_claim = false
    Record.process_batch(contents).each do |record|
      if record.kind_of?(ClaimHeaderRecord)
        if record['Accounting Number'].to_i == claim.number.to_i
          in_claim = true
          records << record
        else
          in_claim = false
        end
      elsif (record.kind_of?(ClaimHeaderRMBRecord) || record.kind_of?(ItemRecord)) && in_claim
        records << record
      end
    end
    records
  end

  def submitted_fee
    claims.reduce(0) { |memo, claim| claim.submitted_fee+memo }
  end
end
