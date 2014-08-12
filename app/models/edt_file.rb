class EdtFile < ActiveRecord::Base
  belongs_to :user

  enum status: %i[ready uploaded acknowledged processed]

  def filename
    filename_base.split('/')[1]+'.'+('%03i' % sequence_number)
  end

  def generate_filename(char, provider, timestamp)
    self.filename_base = timestamp.year.to_s+'/'+char+(timestamp.month+"A".ord-1).chr+("%06i" % provider)
    self.sequence_number = EdtFile.count(filename_base: filename_base)+1
  end
end
