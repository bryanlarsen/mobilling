class GenerateSubmission
  attr_reader :contents, :errors, :timestamp, :provider, :batch_id

  def generate_claim(claim)
    province = (claim.patient_province || 'ON').upcase
    payment_program = claim.payment_program == 'WCB' ? 'WCB' : (province == 'ON' ? 'HCP' : 'RMB')
    if claim.patient_required
      r = claim.to_header_record
      @contents += r.to_s
      @errors[claim.number] += r.errors if r.errors.length > 0
      @num_claim_headers += 1
    end
    if payment_program == 'RMB'
      rmb=claim.to_rmb_record
      @contents += rmb.to_s
      @errors[claim.number] += rmb.errors if rmb.errors.length > 0
      @num_rmb_claims += 1
    end
    claim.items.reduce(0) do |total, item|
      item.rows.reduce(total,) do |total, row|
        r = row.to_record
        @errors[claim.number] += r.errors if r.errors.length > 0
        @contents += r.to_s
        @num_records += 1
        total + row.fee
      end
    end
  end

  def initialize
    @contents = ""
    @errors = Hash.new { |hash, key| hash[key] = [] }
    @num_records = 0
    @num_rmb_claims = 0
    @num_claim_headers = 0
  end

  def perform(user, claims, timestamp=nil)
    @user = user
    @claims = claims

    @timestamp = timestamp || DateTime.now

    r=BatchHeaderRecord.new
    r['Batch Creation Date']=@timestamp.to_date
    r['Batch Identification Number']=@timestamp.strftime("%H%M")
    r['Group Number']=@user.group_number
    r['Health Care Provider']=@user.provider_number
    r['MOH Office Code']=@user.office_code
    r['Specialty']=@user.specialty_code
    @contents += r.to_s
    @errors['header'] = r.errors unless r.errors.empty?
    @batch_id = @contents[7..18]

    claims.each do |claim|
      claim.submitted_fee = generate_claim(claim)
      claim.status = 'file_created'
    end

    tr = BatchTrailerRecord.new
    tr.set_field!('H Count', @num_claim_headers)
    tr.set_field!('R Count', @num_rmb_claims)
    tr.set_field!('T Count', @num_records)
    @contents += tr.to_s
    @errors['trailer'] = tr.errors unless tr.errors.empty?
  end

  def attributes
    {
      user: @user,
      claims: @claims,
      contents: @contents,
      batch_id: @batch_id,
      timestamp: @timestamp,
      provider_number: @user.provider_number
    }
  end

end
