class ClaimFile < ActiveRecord::Base
  belongs_to :claim, inverse_of: :claim_files
  belongs_to :edt_file, inverse_of: :claim_files
end
