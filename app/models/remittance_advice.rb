class RemittanceAdvice < EdtFile
  validate :memo

  @@memos = {}

  def filename_character
    'P'
  end

  def format_message(message)
    if message.match(/   /)
      "```\n#{message}```\n"
    else
      message
    end
  end

  def memo
    return if @memo && @memo[:contents] == contents
    if @@memos[id] && @@memos[id][:contents] == contents
      @memo = @@memos[id]
      return
    end
    @memo = {}
    @@memos[id] = @memo
    @memo[:contents] = contents
    @memo[:records] = Record.process_batch(contents)
    @memo[:claims] = []
    @memo[:claim_records] = {}
    @memo[:claim_attn] = {}
    @memo[:item_records] = {}
    @memo[:premium_records] = {}
    @memo[:message_texts] = []
    @memo[:balance_records] = []
    @memo[:accounting_records] = []
    @memo[:unmatched_records] = []
    @memo[:overtime_records] = []
    @memo[:messages] = []
    current_claim = nil
    @memo[:records].each {|record|
      case
      when record.kind_of?(ReconciliationFileHeader)
        self.user = User.find_by(provider_number: record['Health Care Provider'])
        self.created_at = record['Payment Date']
        if self.user
          @memo[:header] = record
        else
          @memo[:unmatched_records] << record
        end
        @memo[:messages] << "$#{record['Total Amount Payable']} paid on #{record['Payment Date'].to_s(:long)}."
      when record.kind_of?(ReconciliationAddressRecordOne)
        true
      when record.kind_of?(ReconciliationAddressRecordTwo)
        true
      when record.kind_of?(ReconciliationClaimHeader)
        #puts 'claim header', record.fields
        current_claim = Claim.find_by(user_id: user_id, number: record['Accounting Number'].to_i)
        if current_claim.nil?
          @memo[:unmatched_records] << record
        else
          @memo[:claims] << current_claim
          @memo[:claim_records][current_claim.id] = record
          @memo[:item_records][current_claim.id] ||= []
          @memo[:premium_records][current_claim.id] ||= []
        end
      when record.kind_of?(ReconciliationClaimItemHeader)
        #puts 'claim item', record.fields
        claim_item = nil
        if not current_claim.nil?
          daily_index = nil
          premium_index = nil
          found = nil
          current_claim.submitted_details['daily_details'].each_with_index do |daily, i|
            if daily['Service Date'] == record['Service Date']
              if daily['Service Code'] == record['Service Code']
                @memo[:item_records][current_claim.id][i] = record
                if !record['Explanatory Code'].blank?
                  @memo[:claim_attn][current_claim.id] = true
                end
                found = true
              else
                daily['premiums'].each_with_index do |premium, j|
                  @memo[:premium_records][current_claim.id][i] ||= []
                  @memo[:premium_records][current_claim.id][i][j] = record
                  if !record['Explanatory Code'].blank?
                    @memo[:claim_attn][current_claim.id] = true
                  end
                  found = true
                end
              end
            end
          end
          if !found
            @memo[:unmatched_records] << record
          end
        else
          @memo[:unmatched_records] << record
        end
      when record.kind_of?(ReconciliationBalanceForward)
        @memo[:messages] << "*Amount Brought Forward*\n\n- Claim's Adjustment: #{record['Amount Brought Forward - Claim\'s Adjustment']}\n- Advances: #{record['Amount Brought Forward - Advances']}\n- Reductions: #{record['Amount Brought Forward - Reductions']}\n- Other Deductions: #{record['Amount Brought Forward - Other Deductions']}\n"
        @memo[:balance_records] << record
      when record.kind_of?(ReconciliationAccountingTransaction)
        @memo[:messages] << "#{record['Transaction Message']}: #{record['Transaction Amount']}"
        @memo[:accounting_records] << record
      when record.kind_of?(ReconciliationMessageFacility)
        @memo[:message_texts] << record['Message Text']
      else
        errors.add_to_base "Unknown record type: #{record.class}"
      end
    }
    message = ""
    @memo[:message_texts].each do |text|
      if text.match(/^\s*\*\*\*/)
        @memo[:messages] << format_message(message) unless message.blank?
        message = ""
      else
        message += text.rstrip + "\n"
      end
    end
    @memo[:messages] << format_message(message) unless message.blank?

    if !@memo[:unmatched_records].empty?
      @memo[:messages] << "```\nCould not find records for:\n"+@memo[:unmatched_records].join("\n")+"\n```"
    end
  end

  def process!
    memo

    @memo[:claims].each do |claim|
      if @memo[:claim_records][claim.id]
        claim.status = @memo[:claim_attn][claim.id] ? 'agent_attention' : 'done'
        claim.files << self
        claim.details['daily_details'].each_with_index do |daily, i|
          record = @memo[:item_records][claim.id][i]
          if record
            daily['paid'] = record['Amount Paid']
            if !record['Explanatory Code'].blank?
              daily['message'] = "#{record['Explanatory Code']}: #{RemittanceAdviceCode.find_by(code: record['Explanatory Code']).name}"
            end
          end

          (daily['premiums'] || []).each_with_index do |premium, j|
            record = @memo[:premium_records][claim.id][i][j]
            if record
              premium['paid'] = record['Amount Paid']
              if !record['Explanatory Code'].blank?
                premium['message'] = "#{record['Explanatory Code']}: #{RemittanceAdviceCode.find_by(code: record['Explanatory Code']).name}"
              end
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
    @memo[:unmatched_records]
  end

  def messages
    memo
    @memo[:messages]
  end

  def claim_details(claim)
    memo
    return nil if @memo[:claim_records][claim.id].nil?
    { 'items' => @memo[:item_records][claim.id].map.with_index do |record, i|
        { 'premiums' => (@memo[:premium_records][claim.id][i] || []).map(&:fields) }.merge(record.fields)
    end }.merge(@memo[:claim_records][claim.id].fields)
  end
end
