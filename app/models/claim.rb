
require "#{Rails.root}/lib/record_builder.rb"

class Claim < ActiveRecord::Base
  CONSULT_TYPES = %w[general_er general_non_er comprehensive_er comprehensive_non_er limited_er limited_non_er]
  CONSULT_PREMIUM_VISITS = %w[weekday_office_hours weekday_day weekday_evening weekday_night weekend_day weekend_night holiday_day holiday_night]

  enum status: %i[saved unprocessed processed rejected_admin_attention rejected_doctor_attention paid]

  scope :submitted, -> { where(status: statuses.except("saved").values) }

  belongs_to :user
  belongs_to :photo
  has_many :comments

  def self.fee_and_units(service_date, service_code, minutes, fee)
    # adjust based on service_date if unit fee changes
    if service_code.last == 'B'
      unit_fee = BigDecimal.new(1204)/100
      border1 = 60
      border2 = 150
    elsif service_code.last == 'C'
      unit_fee = BigDecimal.new(1501)/100
      border1 = 60
      border2 = 90
    end

    if minutes && minutes>0 && service_code.last != 'A'
      raise RuntimeError, 'non-integral base_fee: perhaps minutes should be 0' if fee % unit_fee != 0

      units = ([minutes, border1].min / 15.0).ceil
      if minutes > border1
        units += ([minutes - border1, border2 - border1].min / 15.0).ceil*2
      end
      if minutes > border2
        units += ((minutes - border2) / 15.0).ceil*3
      end

      raise RuntimeError, 'strange calculations' if fee % unit_fee != 0
      units += (fee / unit_fee).to_i
      fee = units * unit_fee
    else
      if service_code.last != 'A' && fee % unit_fee == 0
        units = (fee / unit_fee).to_i
      else
        units = 1
      end
    end
    [fee, units]
  end

  # note, if minutes is nil or 0, we assume no overtime
  # probably not a good heuristic for 'A' codes
  def self.overtime_rate_and_code(service_datetime, service_code, minutes)
    return [0, nil] if service_code.last == 'A'
    return [0, nil] unless minutes && minutes > 0

    seconds = service_datetime.seconds_since_midnight

    return [0.75, 'E401'+service_code.last] if seconds < 7*60*60

    return [0.5, 'E400'+service_code.last] if seconds >= 17*60*60 ||
      service_datetime.wday == 0 ||
      service_datetime.wday == 6

    date = service_datetime.to_date
    holiday = StatutoryHoliday.find_by(day: date)

    return [0.5, 'E400'+service_code.last] if holiday
    return [0, nil]
  end

  def details_records
    details['daily_details'].map do |dets|
      code = dets['code'][0..4]
      service_code = ServiceCode.find_by(code: code)
      day = Date.strptime(dets['day'])
      fee, units = Claim.fee_and_units(day, code, 0, service_code.fee)

      r = ItemRecord.new
      r['Service Code']=code
      r['Fee Submitted']=fee*100
      r['Number of Services']=units
      r['Service Date']=day
      r['Diagnostic Code']=details['diagnosis'][-3..-1] if details['diagnosis']

      overtime_rate, overtime_code = Claim.overtime_rate_and_code(day, code, 0)
      if overtime_code
        r2=ItemRecord.new
        r2['Service Code']=overtime_code
        r2['Fee Submitted']=fee*overtime_rate
        r2['Number of Services']=units
        r2['Service Date']=day
        r.to_s+r2.to_s
      else
        r.to_s
      end
    end.join
  end
end
