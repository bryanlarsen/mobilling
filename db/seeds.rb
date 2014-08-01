ActiveRecord::Migration.say_with_time "Adding admin account" do
  Admin::User.create(name: "Admin", email: "admin@example.com", password: "secret", role: "admin")
end
