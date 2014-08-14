require "#{Rails.root}/lib/record_builder.rb"

class Submission < EdtFile
  has_many :claims, inverse_of: :submission

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
    submission.batch_id = submission.contents[7..18]

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

  def paid_fee
    claims.reduce(0) { |memo, claim| claim.paid_fee+memo }
  end

  # upload files
  def process!
    Record.process_batch(contents).each {|record|
      case
      when record.kind_of?(BatchHeaderRecord)
        #self.provider = Provider.find_by_code(record['Health Care Provider'])
        #self.group = Group.find_by_code(record['Group Number'])
        self.batch_id = record.to_s[7..18]
      when record.kind_of?(ClaimHeaderRecord)
        self.claims << Claim.new(user_id: user_id).from_record(record)
        self.claims[-1].save!
      when record.kind_of?(ClaimHeaderRMBRecord)
        self.claims[-1].process_rmb_record(record)
        self.claims[-1].save!
      when record.kind_of?(ItemRecord)
        self.claims[-1].process_item(record)
        self.claims[-1].save!
      when record.kind_of?(BatchTrailerRecord)
        nil
      else
        raise InvalidValue, record
      end
    }
    save!
    self
  end

end
