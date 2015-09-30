class Claim::Row < ActiveRecord::Base
  belongs_to :item, inverse_of: :rows
  validation_scope :warnings do |s|
    s.validate :validate_record
  end
  default_scope { order(created_at: :asc) }

  def code_normalized
    return if code.length < 4
    n = code[0..4].upcase
    n[4]='A' if !n[4] || !'ABC'.include?(n[4])
    n
  end

  def to_record
    r = ItemRecord.new
    r.insert('Service Code', :code, code_normalized)
    r.insert('Fee Submitted', :fee, fee)
    r.insert('Number of Services', :units, units)
    r.insert('Service Date', :day, item.day)

    service = ServiceCode.find_by(code: code_normalized)
    if !service
      r.errors << [:code, 'not found']
    else
      if service.requires_diagnostic_code
        unless item.diagnosis.blank?
          diagnosis = item.diagnosis.strip.split(' ').last
          r.insert('Diagnostic Code A', :diagnosis, diagnosis[0..2])
          r.insert('Diagnostic Code B', :diagnosis, diagnosis[3])
        else
          r.errors << [:diagnosis, 'required']
        end
      end
    end
    r
  end

  def validate_record
    to_record.errors.each do |attr, err|
      unless [:diagnosis, :day].include?(attr)
        warnings.add(attr, err.to_s)
      end
    end
  end
end
