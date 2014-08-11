class Submission < EdtFile
  has_many :claims

	def self.generate(user, timestamp=nil)
    submission = self.new
    timestamp = DateTime.now if timestamp.nil?
		claims = user.claims.unprocessed

    r=BatchHeaderRecord.new
    r['Batch Creation Date']=timestamp.to_date
    r['Batch Identification Number']=timestamp.strftime("%H%M")
    r['Group Number']='0000'
    r['Health Care Provider']=18468
    r['MOH Office Code']='D'
    r['Specialty']=0
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

    submission.claims = claims

    submission
  end
end
