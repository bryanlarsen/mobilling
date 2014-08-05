ActiveRecord::Migration.say_with_time "adding admin account" do
  Admin::User.create(name: "Admin", email: "admin@example.com", password: "secret", role: "admin")
end

ActiveRecord::Migration.say_with_time "adding agent account" do
  Admin::User.create(name: "Agent", email: "agent@example.com", password: "secret", role: "agent")
end
