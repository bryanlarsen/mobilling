class ClaimCommentsDropUserType < ActiveRecord::Migration
  def change
    remove_column :claim_comments, :user_type, :string, default: "user"
  end
end
