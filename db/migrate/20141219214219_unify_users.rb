class UnifyUsers < ActiveRecord::Migration
  class User < ActiveRecord::Base
    enum role: %i[doctor agent admin ministry]
  end

  class AdminUser < ActiveRecord::Base
    enum role: %i[agent admin ministry]
  end

  def up
    add_column :users, :role, :integer, default: 0, null: false, index: true
    User.reset_column_information
    AdminUser.find_each do |admin|
      u = User.where(email: admin.email).first_or_create

      puts u.email

      u.role = admin.role
      u.name = admin.name
      u.password_digest = admin.password_digest
      u.save!

      User.where(agent_id: admin.id).update_all(agent_id: u.id)
    end
    drop_table :admin_users
  end
end
