ActiveRecord::Migration.say_with_time "adding admin account" do
  Admin::User.create(name: "Admin", email: "admin@example.com", password: "secret", role: "admin")
end
