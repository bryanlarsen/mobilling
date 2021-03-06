class CreateAdminUsers < ActiveRecord::Migration
  def change
    create_table :admin_users, id: :uuid do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.integer :role, default: 0

      t.timestamps
    end
    add_index :admin_users, :email, unique: true
  end
end
