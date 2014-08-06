class Claim::Comment < ActiveRecord::Base
  belongs_to :user, polymorphic: true
  belongs_to :claim
end
