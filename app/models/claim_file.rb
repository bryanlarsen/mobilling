class ClaimFile < ActiveRecord::Base
  belongs_to :claim, inverse_of: :claim_files
  belongs_to :edt_file, inverse_of: :claim_files

  before_save :set_type

  def set_type
    self.edt_file_type = edt_file.type
  end
end
