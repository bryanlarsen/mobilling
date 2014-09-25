class RemittanceAdvice < EdtFile
  validate :memo
  has_many :claims, inverse_of: :remittance_advice

  def filename_character
    'P'
  end

  def memo
    return if @memo && @memo == contents
    @memo = contents
    @records = Record.process_batch(contents)
    @claims = []
    @claim_records = {}
    @item_records = {}
    @message_text = ""
    @balance_records = []
    @accounting_records = []
    @unmatched_records = []
    @overtime_records = []
    current_claim = nil
    @records.each {|record|
      case
      when record.kind_of?(ReconciliationFileHeader)
        @header = record
      when record.kind_of?(ReconciliationAddressRecordOne)
        true
      when record.kind_of?(ReconciliationAddressRecordTwo)
        true
      when record.kind_of?(ReconciliationClaimHeader)
        #puts 'claim header', record.fields
        current_claim = Claim.find_by(user_id: user_id, number: record['Accounting Number'].to_i)
        if current_claim.nil?
          @unmatched_records << record
        else
          @claims << current_claim
          @claim_records[current_claim.id] = record
          @item_records[current_claim.id] ||= []
        end
      when record.kind_of?(ReconciliationClaimItemHeader)
        #puts 'claim item', record.fields
        claim_item = nil
        if not current_claim.nil?
          claim_item = current_claim.submitted_details['daily_details'].find_index {|dets|
            dets['Service Date'] == record['Service Date'] &&
            dets['Service Code'] == record['Service Code']
          }
          if !claim_item.nil?
            @item_records[current_claim.id][claim_item] = record
          else
            @unmatched_records << record
          end
        else
          @unmatched_records << record
        end
      when record.kind_of?(ReconciliationBalanceForward)
        @balance_records << record
      when record.kind_of?(ReconciliationAccountingTransaction)
        @accounting_records << record
      when record.kind_of?(ReconciliationMessageFacility)
        @message_text += record['Message Text']+"\n"
      else
        errors.add_to_base "Unknown record type: #{record.class}"
      end
    }
  end

  def process!
    memo
    @claims.each do |claim|
      if @claim_records[claim.id]
        claim.status = 'paid'
        claim.remittance_advice = self
        claim.save!
      end
    end
  end

  def claim_details(claim)
    memo
    return nil if @claim_records[claim.id].nil?
    { 'items' => @item_records[claim.id].map(&:fields) }.merge(@claim_records[claim.id].fields)
  end
end
