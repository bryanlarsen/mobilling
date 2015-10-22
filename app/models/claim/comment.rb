class Claim::Comment < ActiveRecord::Base
  belongs_to :user, inverse_of: :comments
  belongs_to :claim, inverse_of: :comments

  def as_json
    {
      id: id,
      claim_id: claim_id,
      body: body,
      user_name: user.try(:name),
      user_id: user.try(:id),
      created_at: created_at,
      read: read
    }
  end
end
