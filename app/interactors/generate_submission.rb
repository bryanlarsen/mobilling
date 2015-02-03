class GenerateSubmission
  attr_reader :contents, :errors, :timestamp, :provider, :batch_id

  def generate_claim(claim)

    raise RuntimeError, 'accounting number required' if not claim.number

    name_err = lambda {
      @errors[claim.number] += [['patient_name', 'must be of form First Last, ON 9876543217XX, 2001-12-25, M']]
    }

    if claim.details['patient_name']
      if claim.details['patient_name'].match(/,/)
        last_name, first_name = claim.details['patient_name'].split(',')
      else
        first_name, last_name = claim.details['patient_name'].split(' ')
      end
      return @errors[claim.number] += [['patient_name', 'must contain first and last name']] if !(last_name && first_name)

      last_name.strip!
      first_name.strip!
    end

    province = claim.details['patient_province'].upcase
    payment_program = claim.details['payment_program'] == 'WCB' ? 'WCB' : (province == 'ON' ? 'HCP' : 'RMB')

    referring_provider = claim.details['referring_physician']
    if referring_provider
      referring_provider = referring_provider.to_s.split(' ')[0]
      if referring_provider !='0' && (referring_provider.length < 5 || referring_provider.length > 6)
        @errors[claim.number] += [['referring_provider', 'invalid']]
        return
      end
    end

    facility = claim.details['hospital'].split(' ')[0]

    r=ClaimHeaderRecord.new
    r["Patient's Birthdate"]=Date.strptime(claim.details['patient_birthday'])
    r['Accounting Number']=claim.number
    r['Payment Program']=payment_program
    r['Payee']=claim.details['payee'] || 'P'
    r['Referring Health Care Provider Number']=referring_provider if referring_provider
    r['Master Number']=facility
    r['In-Patient Admission Date']=Date.strptime(claim.details['admission_on']) if claim.details['admission_on']
    r['Referring Laboratory License Number']=claim.details['referring_laboratory'] if claim.details['referring_laboratory']
    r['Manual Review Indicator']=claim.details['manual_review_indicator'].blank? ? '' : 'Y'
    r['Service Location Indicator']=claim.details['service_location'] if claim.details['service_location']

    if payment_program == 'RMB'
      sex = claim.details['patient_sex'].strip[0].upcase
      if sex == 'M'
        sex = 1
      elsif sex == 'F'
        sex = 2
      else
        raise RuntimeError, error if sex.strip.length != 1
      end

      rmb=ClaimHeaderRMBRecord.new
      rmb['Registration Number']=claim.details['patient_number']
      rmb["Patient's Last Name"]=last_name
      rmb["Patient's First Name"]=first_name
      rmb["Patient's Sex"]=sex
      rmb["Province Code"]=province
      @contents += r.to_s
      @errors[claim.number] += r.errors if r.errors.length > 0
      @contents += rmb.to_s
      @errors[claim.number] += rmb.errors if rmb.errors.length > 0
      @num_rmb_claims += 1
    else
      r['Health Number']=claim.details['patient_number'][0..9]
      r['Version Code']=claim.details['patient_number'][10..11].upcase
      @contents += r.to_s
      @errors[claim.number] += r.errors if r.errors.length > 0
    end
    claim.items.each do |daily|
      generate_details(daily, claim)
    end
  end

  def generate_details(daily, claim)
    r = ItemRecord.new
    r['Service Code']=daily[:code]
    r['Fee Submitted']=daily[:fee]*100
    r['Number of Services']=daily[:units]
    r['Service Date']=daily[:day]
    r['Diagnostic Code']=claim.details['diagnosis'][-3..-1] if claim.details['diagnosis']

    @contents += r.to_s
    @errors[claim.number] += r.errors if r.errors.length > 0
    @num_records += 1

    daily[:premiums].each do |premium|
      generate_premium(premium, daily, claim)
    end
  end

  def generate_premium(premium, daily, claim)
    r = ItemRecord.new
    r['Service Code']=premium[:code]
    r['Fee Submitted']=premium[:fee]*100
    r['Number of Services']=premium[:units]
    r['Service Date']=daily[:day]
    r['Diagnostic Code']=claim.details['diagnosis'][-3..-1] if claim.details['diagnosis']

    @contents += r.to_s
    @errors[claim.number] += r.errors if r.errors.length > 0
    @num_records += 1
  end

  def initialize
    @contents = ""
    @errors = Hash.new { |hash, key| hash[key] = [] }
    @num_records = 0
    @num_rmb_claims = 0
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
      generate_claim(claim)
      claim.status = 'file_created'
    end

    tr = BatchTrailerRecord.new
    tr.set_field!('H Count', claims.length)
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
