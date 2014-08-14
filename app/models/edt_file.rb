class EdtFile < ActiveRecord::Base
  belongs_to :user

# defined in children, so class_name can be more specific
#  belongs_to :parent, class_name => "EdtFile"

  enum status: %i[ready uploaded acknowledged]

  def filename
    filename_base.split('/').last+'.'+('%03i' % sequence_number)
  end

  def filename=(val)
    self.filename_base, seq = val.split('.')
    self.sequence_number = seq.to_i
  end

  def generate_filename(char, user, provider, timestamp)
    self.filename_base = timestamp.year.to_s+'/'+char+(timestamp.month+"A".ord-1).chr+("%06i" % provider)
    self.sequence_number = EdtFile.where(user_id: user.id, filename_base: filename_base).count+1
  end

  def self.new_child(params)
    case params[:filename][0..0]
    when 'H'
      Submission.new(params)
    when 'B'
      BatchAcknowledgment.new(params)
#    when 'X'
#      FileRejection.new(params)
    when 'P'
      RemittanceAdvice.new(params)
#    when 'E'
#      ErrorReport.new(params)
    else
      raise RuntimeError, 'unknown file'
      EdtFile.new(params)
    end
  end
end