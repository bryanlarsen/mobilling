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

    return "matching submission not found for batch report" if submission.nil?

    self.parent = submission
    self.save!

    if record['Micro Start'].blank?
      submission.status = 'rejected'
      submission.save!

      submission.claims.each do |claim|
        claim.status = 'for_agent'
        claim.batch_acknowledgment = self
        claim.comments.create!(body: record['Edit Message'])
        claim.save!
      end
    else
      submission.status = 'acknowledged'
      submission.save!

      submission.claims.each do |claim|
        claim.status = 'acknowledged'
        claim.batch_acknowledgment = self
        claim.save!
      end
    end
    nil
  end
end
