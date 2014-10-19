class BatchAcknowledgment < EdtFile
  belongs_to :parent, :class_name => "Submission"
  has_many :claims

  def filename_character
    'H'
  end

  def process!
    record = Record.process_batch(contents)[0]
    self.user = User.find_by(provider_number: record['Provider Number'])
    submission = Submission.find_by(user_id: user.id,
                                    batch_id: contents[17..28])

    submission.status = 'acknowledged'
    submission.save!

    self.parent = submission
    self.save!

    return if submission.nil?
    if record['Micro Start'].blank?
      # FIXME: fail submission with record['Edit Message']
    else
      submission.claims.each do |claim|
        claim.status = 'acknowledged'
        claim.batch_acknowledgment = self
        claim.save!
      end
    end
  end
end
