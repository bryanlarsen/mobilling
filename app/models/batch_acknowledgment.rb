class BatchAcknowledgment < EdtFile
  belongs_to :parent, :class_name => "Submission"
  has_many :claims

  def process!
    record = Record.process_batch(contents)[0]
    submission = Submission.find_by(user_id: user_id,
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
        claim.status = 'processed'
        claim.batch_acknowledgment = self
        claim.save!
      end
    end
  end
end
