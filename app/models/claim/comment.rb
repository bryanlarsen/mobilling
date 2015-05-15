class Claim::Comment < ActiveRecord::Base
  belongs_to :user, inverse_of: :comments
  belongs_to :claim, inverse_of: :comments
end
