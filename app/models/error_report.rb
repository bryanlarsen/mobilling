class ErrorReport < EdtFile
  validate :memo

  def filename_character
    'P'
  end

  def memo
    return if @memo && @memo == contents
    @memo = contents
    @records = Record.process_batch(contents)
    @claims = []
    @claim_header_records = {}
    @claim_rmb_records = {}
    @item_records = {}
    @premium_records = {}
    @balance_records = []
    @accounting_records = []
    @unmatched_records = []
    @overtime_records = []
    @message_records = {}
    @messages = []
    current_claim = nil
    @records.each {|record|
      case
      when record.kind_of?(ErrorReportHeader)
        self.user = User.find_by(provider_number: record['Provider Number'])
        self.created_at = record['Claim Process Date']
        if self.user
          @header = record
        else
          @unmatched_records << record
        end
      when record.kind_of?(ErrorReportClaimHeader1)
        current_claim = Claim.find_by(user_id: user_id, number: record['Accounting Number'].to_i)
        if current_claim.nil?
          @unmatched_records << record
        else
          @claims << current_claim
          @claim_header_records[current_claim.id] = record
          @item_records[current_claim.id] ||= {}
          @premium_records[current_claim.id] ||= []
          @message_records[current_claim.id] ||= []
        end
      when record.kind_of?(ErrorReportClaimHeaderRMB)
        if current_claim
          @claim_rmb_records[current_claim.id] = record
        else
          @unmatched_records << record
        end
      when record.kind_of?(ErrorReportItem)
        claim_item = nil
        if not current_claim.nil?
          found = nil
          current_claim.submitted_details['items'].each do |daily|
            if daily['Service Date'] == record['Service Date']
              if daily['Service Code'] == record['Service Code']
                @item_records[current_claim.id][daily[:row_id]] = record
                found = true
              end
            end
          end
          if !found
            @unmatched_records << record
          end
        else
          @unmatched_records << record
        end
      when record.kind_of?(ErrorReportExplanationCodeMessage)
        if current_claim
          @message_records[current_claim.id] << record
        else
          @unmatched_records << record
        end
      when record.kind_of?(ErrorReportTrailer)
        true
      else
        errors.add_to_base "Unknown record type: #{record.class}"
      end
    }

    if !@unmatched_records.empty?
      @messages << "```\nCould not find records for:\n"+@unmatched_records.join("")+"\n```"
    end
  end

  def messageFor(record, message_records)
    messages = []
    unless record.class.field_definitions["Explanatory Code"].nil? || record['Explanatory Code'].blank?
      code = ErrorReportExplanatoryCode.find_by(code: record['Explanatory Code'])
      if code
        messages << "#{code.code}: #{code.name}"
      else
        messages << "#{record['Explanatory Code']}: (unknown)"
      end
    end
    (1..5).each do |n|
      unless record["Error Code #{n}"].blank?
        conds = ErrorReportRejectionCondition.where(code: record["Error Code #{n}"])
        if conds.blank?
          messages << record["Error Code #{n}"] + ": (unknown)"
        else
          messages << conds.map do |cond|
            "#{cond.code}: #{cond.name}"
          end.join("\n")
        end
      end
    end
    message_records.each do |mr|
      unless mr['Explanatory Code'].blank?
        code = ErrorReportExplanatoryCode.find_by(code: mr['Explanatory Code'])
        messages << "#{mr['Explanatory Code']}: #{code ? code.name : ''}"
      end
      messages << mr['Explanatory Description']
    end
    messages.map do |msg|
      "- "+msg
    end.join("\n")
  end

  def process!
    memo

    comment_user = User.find_by(role: User.roles["ministry"])
    @claims.each do |claim|
      if @claim_header_records[claim.id]
        claim.status = 'agent_attention'
        claim.files << self

        unless messageFor(@claim_header_records[claim.id], []).blank?
          claim.comments.create!(body: messageFor(@claim_header_records[claim.id], []), user: comment_user)
        end
        claim.items.each_with_index do |item|
          item.rows.each do |row|
            record = @item_records[claim.id][row.id]
            if record
              row.message = messageFor(record, @message_records[claim.id])
              row.save!
            end
          end
        end
        claim.save!
      end
    end
    save!

    nil
  end

  def unmatched_records
    memo
    @unmatched_records
  end

  def messages
    memo
    @messages
  end

  def claim_details(claim)
    memo
    return nil if @claim_records[claim.id].nil?
    { 'items' => @item_records[claim.id].map.with_index do |record, i|
        { 'premiums' => (@premium_records[claim.id][i] || []).map(&:fields) }.merge(record.fields)
    end }.merge(@claim_records[claim.id].fields)
  end
end
