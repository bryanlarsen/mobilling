class ClaimFile < ActiveRecord::Base
  belongs_to :claim
  belongs_to :edt_file
end
