class AddDefaultSpecialtyToUser < ActiveRecord::Migration
  class User < ActiveRecord::Base
  end

  def up
    add_column :users, :default_specialty, :string, :limit => 255
    User.reset_column_information

    User.find_each do |user|
      user.default_specialty = user.specialties.first || ""
      user.save!
    end
  end

  def down
    remove_column :users, :default_specialty
  end
end
