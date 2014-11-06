class EdtFile < ActiveRecord::Base
  belongs_to :user

  scope :submissions, -> { where(type: 'Submission') }
  scope :remittance_advices, -> { where(type: 'RemittanceAdvice') }
  scope :batch_acknowledgments, -> { where(type: 'BatchAcknowledgment') }
  scope :error_reports, -> { where(type: 'ErrorReport') }

  has_many :claims, :through => :claim_files
  has_many :claim_files

# defined in children, so class_name can be more specific
#  belongs_to :parent, class_name => "EdtFile"

  enum status: %i[ready uploaded acknowledged rejected]

  def filename
    filename_base.split('/').last+'.'+('%03i' % sequence_number)
  end

  def filename=(val)
    self.filename_base, seq = val.split('.')
    self.filename_base = "#{(self.created_at || Date.today).year}/#{self.filename_base}" unless self.filename_base.include?("/")
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

  def messages
    []
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
    when 'E'
      ErrorReport.new(params)
    else
      raise RuntimeError, 'unknown file'
      EdtFile.new(params)
    end
  end
end
