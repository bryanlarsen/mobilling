ActiveRecord::Migration.say_with_time "create_admin" do
  Admin::User.create(name: "Admin", email: "admin@example.com", password: "secret", role: "admin")
end

ActiveRecord::Migration.say_with_time "create_agent" do
  Admin::User.create(name: "Agent", email: "agent@example.com", password: "secret", role: "agent")
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
    code = line[-6..-2].strip
    desc = line[0..-9].strip
    {name: "#{code} #{desc}"}
  end
  ServiceCode.create(service_codes)
end
