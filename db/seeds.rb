ActiveRecord::Migration.say_with_time "create_admin" do
  Admin::User.where(name: "Admin").first_or_create(email: "admin@example.com", password: "secret", role: "admin")
end

ActiveRecord::Migration.say_with_time "create_agent" do
  Admin::User.where(name: "Agent").first_or_create(email: "agent@example.com", password: "secret", role: "agent")
end

ActiveRecord::Migration.say_with_time "create_hospitals" do
  Hospital.destroy_all
  hospitals = open(Rails.root.join("db/seeds/hospitals.txt")).readlines.map { |l| {name: l.strip} }
  Hospital.create(hospitals)
end

ActiveRecord::Migration.say_with_time "create_diagnoses" do
  Diagnosis.destroy_all
  diagnoses = open(Rails.root.join("db/seeds/diagnoses.txt")).readlines.map { |l| {name: l.strip} }
  Diagnosis.create(diagnoses)
end

ActiveRecord::Migration.say_with_time "create_service_codes" do
  ServiceCode.destroy_all
  service_codes = open(Rails.root.join("db/seeds/service_codes.txt")).readlines.map do |line|
    match = line.strip.match(/\A(.*)\((.*)\)\Z/)
    code = match[2].strip
    description = match[1].strip
    {name: "#{code} #{description}".strip, code: code}
  end
  ServiceCode.create(service_codes)
end

ActiveRecord::Migration.say_with_time "schedule_master" do
  Rails.root.join("db/seeds/schedule_master.txt").readlines.each do |line|
    code = line.slice(0,4)
    effective_date = Date.strptime(line.slice(4,8),"%Y%m%d")
    if line.slice(12, 8)=='99999999'
      end_date = nil
    else
      if line.slice(18, 2)=='00'
        end_date = Date.strptime(line.slice(12,6)+'01', "%Y%m%d")
      else
        end_date = Date.strptime(line.slice(12,8), "%Y%m%d")
      end
    end
    primary_fee = line.slice(20,9).to_i
    assistant_fee = line.slice(31,9).to_i
    specialist_fee = line.slice(42,9).to_i
    anaesthetist_fee = line.slice(53,9).to_i
    anaesthetist_fee = line.slice(64,9).to_i if anaesthetist_fee==0

    # puts code, effective_date, primary_fee, assistant_fee, specialist_fee, anaesthetist_fee

    # bug fixes
    # assistant_fee = 72.8 if ['S740', 'S733', 'S751'].include?(line.slice(0,4))

    if primary_fee!=0 or (assistant_fee==0 and anaesthetist_fee==0 and specialist_fee==0)

      ServiceCode.where(:code => code+'A')
        .update_all(effective_date: effective_date,
                    termination_date: end_date,
                    fee: primary_fee)
    end
    if assistant_fee!=0
      ServiceCode.where(:code => code+'B')
        .update_all(effective_date: effective_date,
                    termination_date: end_date,
                    fee: assistant_fee)
    end
    if anaesthetist_fee!=0
      ServiceCode.where(:code => code+'C')
        .update_all(effective_date: effective_date,
                    termination_date: end_date,
                    fee: anaesthetist_fee)
    end
    if specialist_fee!=0 and primary_fee==0
      ServiceCode.where(:code => code+'A')
        .update_all(effective_date: effective_date,
                    termination_date: end_date,
                    fee: specialist_fee,
                    requires_specialist: true)
    end
  end
end

ActiveRecord::Migration.say_with_time "remittance_advice_codes" do
  inside = false
  current_code = nil
  current_text = ''
  count = 0

  finish_code = lambda do
    return if current_code.nil?
    code = RemittanceAdviceCode.find_or_create_by!(:code => current_code)
    code.name = current_text unless current_text.blank?
    code.save!
    current_code=nil
    count += 1
  end

  Rails.root.join("db/seeds/tech_specific.txt").readlines.each do |line|
    if inside
      if line =~ /^\s\s([A-Z0-9][A-Z0-9])\s+(.*)/
        finish_code.call
        current_code = $1
        current_text = $2
      elsif line =~ /^\s{4,20}(\S.*)/
        current_text += ' '+$1
      elsif line =~ /^7./
        inside = false
      else
        finish_code.call
      end
    elsif line =~ /^6.8\s+Remittance Advice Explanatory Codes/
      inside = true
    end
  end

  puts "#{count} codes"
end
