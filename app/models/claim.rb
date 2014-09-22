
require "#{Rails.root}/lib/record_builder.rb"

class Claim < ActiveRecord::Base
  CONSULT_TYPES = %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er special_er special_non_er on_call_admission_er on_call_admission_non_er]
  CONSULT_PREMIUM_VISITS = %w[weekday_office_hours weekday_day weekday_evening weekday_night weekend_day weekend_night holiday_day holiday_night]

  enum status: %i[saved unprocessed processed rejected_admin_attention rejected_doctor_attention paid]

  scope :submitted, -> { where(status: statuses.except("saved").values) }

  belongs_to :user
  belongs_to :photo
  has_many :comments, inverse_of: :claim

  belongs_to :submission
  belongs_to :batch_acknowledgment
  belongs_to :error_report
  belongs_to :remittance_advice
#  belongs_to :reclaim, class_name: "Claim"

  def details_records
    details['daily_details'].map do |dets|
      code = dets['code'][0..4].upcase
      code[4]='A' if !code[4] || !'ABC'.include?(code[4])
      day = Date.strptime(dets['day'])
      time_in = dets['time_in'] && dets['time_in'].match(/^\d{1,2}:\d{2}$/) &&  Time.strptime(dets['time_in'], "%H:%M")
      time_out = dets['time_out'] && dets['time_out'].match(/^\d{1,2}:\d{2}$/) &&  Time.strptime(dets['time_out'], "%H:%M")
      if time_in && time_out
        day_with_time = day.to_datetime + time_in.seconds_since_midnight.seconds
        minutes = (time_out - time_in) / 60
        minutes += 24*60 if minutes < 0
      else
        minutes = 0
      end

      r = ItemRecord.new
      r['Service Code']=code
      r['Fee Submitted']=dets['fee']
      r['Number of Services']=dets['units']
      r['Service Date']=day
      r['Diagnostic Code']=details['diagnosis'][-3..-1] if details['diagnosis']

      r.to_s
    end.join
  end

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
  def to_record
    #  current assumptions
    payee = 'P'

    raise RuntimeError, 'accounting number required' if not number

    error = 'patient_name must be of form First Last, ON 9876543217XX, 2001-12-25, M'
    name, provhn, birthday, sex = details['patient_name'].split(',')
    raise RuntimeError, error if not provhn

    first_name, last_name = name.split(' ')
    raise RuntimeError, error if not last_name

    province, health_number = provhn.strip.split(' ')
    raise RuntimeError, error if not health_number
    raise RuntimeError, error if province.length != 2
    province = province.upcase
    payment_program = province == 'ON' ? 'HCP' : 'RMB'

    birthday = Date.strptime(birthday.strip)
    raise RuntimeError, error if not birthday

    referring_provider = details['referring_physician']
    if referring_provider
      referring_provider = referring_provider.split(' ')[0]
      raise RuntimeError, 'invalid referring provider' if referring_provider.length != 6
    end

    facility = details['hospital'].split(' ')[0]

    r=ClaimHeaderRecord.new
    r["Patient's Birthdate"]=birthday
    r['Accounting Number']=number
    r['Payment Program']=payment_program
    r['Payee']=payee
    r['Referring Health Care Provider Number']=referring_provider if referring_provider
    r['Master Number']=facility
    r['In-Patient Admission Date']=Date.strptime(details['admission_on']) if details['admission_on']
    #r['Referring Laboratory License Number']=referring_laboratory.code if referring_laboratory
    #r['Manual Review Indicator']='Y' if manual_review
    #r['Service Location Indicator']=service_location.code if service_location

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
      r.to_s+rmb.to_s+details_records
    else
      r['Health Number']=health_number[0..9]
      r['Version Code']=health_number[10..11].upcase
      r.to_s+details_records
    end
  end

  def from_record(record)
    details_will_change!
    if record['Health Number'] != 0
      details['patient_name'] = "Unknown Name, ON #{record['Health Number']}#{record['Version Code']}, #{record['Patient\'s Birthdate']}"
    else
      details['patient_name'] = record["Patient's Birthdate"]
      # the rest will be on the RMB record
    end
    #self.payment_program = PaymentProgram.find_by_code(record['Payment Program'])
    #self.payee = Payee.find_by_code(record['Payee'])
    details['referring_physician'] = record['Referring Health Care Provider Number']
    details['hospital'] = record['Master Number']
    #record['Service Location Indicator'].strip != ''
    #manual_review = (record['Manual Review Indicator']=='Y')
    #record['Referring Laboratory License Number']
    details['admission_on'] = record["In-Patient Admission Date"].strftime("%Y-%m-%d") if record["In-Patient Admission Date"]
    self.number = record["Accounting Number"].to_i
    details['daily_details'] = []
    self.status = 'unprocessed'
    self
  end

  def process_rmb_record(record)
    details_will_change!
    details['patient_name'] = record["Patient's Last Name"].titleize + ' ' + record["Patient's First Name"].titleize + ", #{record['Registration Number']}, #{details['patient_name']}, " + record["Patient's Sex"].to_i == 1 ? 'M' : 'F'
  end

  def process_item(record)
    details_will_change!
    details['daily_details'] << {
      "code" => record['Service Code'],
      "fee" => record['Fee Submitted'],
      "units" => record['Number of Services'],
      "day" => record['Service Date'].strftime("%Y-%m-%d"),
    }
  end

  # we get information like total fee from the batch files rather than
  # calculating it because these calculations can change over time
  # so make sure a claim is never changed after it is submitted.   If
  # you need to change a claim, clone it first
  def submitted_details
    return @submitted_details if @submitted_details

    @submitted_details = { 'daily_details' => [] }
    if submission
      records = submission.claim_records(self)
    else
      records = Record.process_batch(to_record)
    end

    records.each do |record|
      if record.kind_of?(ClaimHeaderRecord) || record.kind_of?(ClaimHeaderRMBRecord)
        @submitted_details.merge(record.fields)
      elsif record.kind_of?(ItemRecord)
        @submitted_details['daily_details'] << record.fields
      end
    end

    @submitted_details
  end

  def submitted_fee
    submitted_details['daily_details'] .reduce(0) { |sum, dets|
      sum += dets['Fee Submitted']
    }
  end

  def remittance_details
    return nil if remittance_advice_id.nil?
    remittance_advice.claim_details(self)
  end

  def paid_fee
    return 0 if remittance_details.nil?
    remittance_details['items'].reduce(0) { |memo, dets|
      memo += dets['Amount Paid']
    }
  end
end
