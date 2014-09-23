class GenerateSubmission
  attr_reader :contents, :errors, :timestamp, :provider, :batch_id

  # current assumptions:
  # patient_name must be of form "First Last, ON 9876543217XX, 2001-12-25, M"
  # payment program auto-selects between HCP and RMB; other forms not supported (worker's comp, etc)
  # time in and time out is assumed to be named "time_in" and "time_out" in daily_details, and is in format "13:54".  Can be missing/nil if not needed.
  # all times/dates in database are in local time
  # payee is Provider (P)
  # referring_laboratory is nil
  # manual review indicator is nil
  # service location is nil, should be one of [nil, "HDS", "HED", "HIP", "HOP"]
  # group code is assumed to be "0000" (private practice)
  # mri/mro code is 'D' (Ottawa)
  # specialty is 0: family medicine
  # provider is 18468 (Dr. B. Jackson)
  def generate_claim(claim)
    #  current assumptions
    payee = 'P'
    referring_laboratory = nil
    manual_review = false
    service_location = nil

    raise RuntimeError, 'accounting number required' if not claim.number

    name_err = lambda {
      @errors << [claim.number, [['patient_name', 'must be of form First Last, ON 9876543217XX, 2001-12-25, M']]]
    }

    name, provhn, birthday, sex = claim.details['patient_name'].split(',')
    return name_err.call if not provhn

    first_name, last_name = name.split(' ')
    return name_err.call if not last_name

    province, health_number = provhn.strip.split(' ')
    return name_err.call if not health_number
    return name_err.call if province.length != 2

    province = province.upcase
    payment_program = province == 'ON' ? 'HCP' : 'RMB'

    birthday = Date.strptime(birthday.strip)
    return name_err.call if not birthday

    referring_provider = claim.details['referring_physician']
    if referring_provider
      referring_provider = referring_provider.split(' ')[0]
      if referring_provider.length < 5 || referring_provider.length > 6
        @errors << [claim.number, [['referring_provider', 'invalid']]]
        return
      end
    end

    facility = claim.details['hospital'].split(' ')[0]

    r=ClaimHeaderRecord.new
    r["Patient's Birthdate"]=birthday
    r['Accounting Number']=claim.number
    r['Payment Program']=payment_program
    r['Payee']=payee
    r['Referring Health Care Provider Number']=referring_provider if referring_provider
    r['Master Number']=facility
    r['In-Patient Admission Date']=Date.strptime(claim.details['admission_on']) if claim.details['admission_on']
    r['Referring Laboratory License Number']=referring_laboratory.code if referring_laboratory
    r['Manual Review Indicator']='Y' if manual_review
    r['Service Location Indicator']=service_location.code if service_location

    if payment_program == 'RMB'
      sex = sex.strip[0].upcase
      if sex == 'M'
        sex = 1
      elsif sex == 'F'
        sex = 2
      else
        raise RuntimeError, error if sex.strip.length != 1
      end

      rmb=ClaimHeaderRMBRecord.new
      rmb['Registration Number']=health_number
      rmb["Patient's Last Name"]=last_name
      rmb["Patient's First Name"]=first_name
      rmb["Patient's Sex"]=sex
      rmb["Province Code"]=province
      @contents += r.to_s
      @errors += [claim.number, r.errors] if r.errors.length > 0
      @contents += rmb.to_s
      @errors += [claim.number, rmb.errors] if rmb.errors.length > 0
    else
      r['Health Number']=health_number[0..9]
      r['Version Code']=health_number[10..11].upcase
      @contents += r.to_s
      @errors += [claim.number, r.errors] if r.errors.length > 0
    end
    claim.details['daily_details'].each do |daily|
      generate_details(daily, claim)
    end
  end

  def generate_details(daily, claim)
    code = daily['code'][0..4].upcase
    code[4]='A' if !code[4] || !'ABC'.include?(code[4])
    day = Date.strptime(daily['day'])

    r = ItemRecord.new
    r['Service Code']=code
    r['Fee Submitted']=daily['fee']
    r['Number of Services']=daily['units']
    r['Service Date']=day
    r['Diagnostic Code']=claim.details['diagnosis'][-3..-1] if claim.details['diagnosis']

    @contents += r.to_s
    @errors += ["#{claim.number}:#{daily['code'][0..4]}", r.errors] if r.errors.length > 0
  end

  def initialize
    @contents = ""
    @errors = []
  end

  def perform(user, claims, timestamp=nil)
    # assumptions: FIXME
    @user = user
    @claims = claims
    @provider = 18468
    group_number = '0000'
    office_code = 'D'
    specialty = 0

    @timestamp = timestamp || DateTime.now

    r=BatchHeaderRecord.new
    r['Batch Creation Date']=@timestamp.to_date
    r['Batch Identification Number']=@timestamp.strftime("%H%M")
    r['Group Number']=group_number
    r['Health Care Provider']=@provider
    r['MOH Office Code']=office_code
    r['Specialty']=specialty
    @contents += r.to_s
    @errors += r.errors
    @batch_id = @contents[7..18]

    num_records = 0
    claims.each do |claim|
      generate_claim(claim)
      num_records += claim.details['daily_details'].length
    end

    tr = BatchTrailerRecord.new
    tr.set_field!('H Count', claims.length)
    tr.set_field!('T Count', num_records)
    @contents += tr.to_s
    @errors += tr.errors
  end

  def attributes
    {
      user: @user,
      claims: @claims,
      contents: @contents,
      batch_id: @batch_id
    }
  end

end
