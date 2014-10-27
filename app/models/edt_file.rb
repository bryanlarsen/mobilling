class EdtFile < ActiveRecord::Base
  belongs_to :user

  has_many :claims, inverse_of: :submission, foreign_key: "submission_id"

# defined in children, so class_name can be more specific
#  belongs_to :parent, class_name => "EdtFile"

  enum status: %i[ready uploaded acknowledged rejected]

  def filename
    filename_base.split('/').last+'.'+('%03i' % sequence_number)
  end

  def filename=(val)
    self.filename_base, seq = val.split('.')
    self.sequence_number = seq.to_i
  end

  def timestamp=(timestamp)
    @timestamp = timestamp
    possibly_generate_filename
  end

  def provider_number=(n)
    @provider_number = n
    possibly_generate_filename
  end

  def possibly_generate_filename
    return unless @timestamp && @provider_number
    return if self.sequence_number
    self.filename_base = @timestamp.year.to_s+'/'+filename_character+(@timestamp.month+"A".ord-1).chr+("%06i" % @provider_number)
    self.sequence_number = EdtFile.where(user_id: user.id, filename_base: filename_base).count+1
  end

  def filename_character
    raise StandardError.new, "pure virtual method called"
  end

  def records
    Record.process_batch(contents)
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
