require 'fileutils'
require 'date'
require 'rubygems'

OrderedHash = ActiveSupport::OrderedHash

class ValueRequired < StandardError
  def to_s
    "Value required"
  end
end

class InvalidValue < StandardError
  def initialize(value)
    @value = value
  end

  def to_s
    "Cannot have value #{@value}"
  end
end

class FieldDefinition
  attr_reader :start, :length, :spec, :required, :display

  def initialize(start, length, required, display, spec={})
    @start = start
    @length = length
    @spec = spec
    @required = required
    @display = display
  end

  def insert(record, value, &on_err)
    if not value
      if !@required
        record[start-1, length] = ' '*length
      elsif @spec[:value]
        record[start-1, length] = format(@spec[:value])
      elsif @spec[:default]
        record[start-1, length] = format(@spec[:default])
      else
        on_err.call(ValueRequired.new)
      end
    else
      begin
        if validate(value)
          record[start-1, length] = format(value)
        else
          raise InvalidValue.new(value)
        end
      rescue StandardError => e
        on_err.call(e)
      end
    end
    record
  end

  # pure virtual 
  def validate(val)
    true
  end

  # pure virtual
  def parse(record)
    true
  end
end

# alphanumeric
class X < FieldDefinition
  def validate(val)
    val.length <= length
  end

  def format(value)
    value[0...length] + ' '*[0,length-value.length].max
  end

  def parse(record)
    record[start-1, length].rstrip
  end
end

# numeric
class N < FieldDefinition
  def validate(val)
    # will throw if cannot convert to integer
    ("%*i" % [length, val.is_a?(String) ? Integer(val, 10) : val]).length <= length
  end

  def format(value)
    "%0*i" % [length, value.is_a?(String) ? Integer(value, 10) : value]
  end

  def parse(record)
    val = record[start-1, length].to_i(10)
    if spec[:sign]
      val = -val if record[spec[:sign]-1,1]=='-'
    end
    val
  end
end

# numeric left justified
class NS < FieldDefinition
  def validate(val)
    # will throw if cannot convert to integer
    ("%*i" % [length, val.is_a?(String) ? Integer(val, 10) : val]).length <= length
  end

  def format(value)
    value = value.to_s
    value[0...length] + ' '*[0,length-value.length].max
  end

  def parse(record)
    record[start-1, length].to_i(10)
  end
end

# currency
class C < N
  def parse(record)
    BigDecimal.new(super(record)) / BigDecimal("100")
  end
end


# all caps alphabetic
class A < FieldDefinition
  def validate(val)
    I18n.transliterate(val) =~ /^[- 'A-Za-z]*$/ and super(val)
  end

  def format(value)
    v = I18n.transliterate(value.gsub(/[- ']/, "")).upcase
    v[0...length] + ' '*[0,length-v.length].max
  end

  def parse(record)
    record[start-1, length].rstrip
  end
end

# date
class D < FieldDefinition
  def validate(val)
    val.blank? || val.respond_to?(:strftime)
  end

  def format(value)
    value.blank? ? " "*8 : value.strftime("%Y%m%d")
  end

  def parse(record)
    if record[start-1, length].blank?
      nil
    else
      Date::strptime(record[start-1, length], "%Y%m%d")
    end
  end

end

# spaces
class S < FieldDefinition
  def format(value)
    ' '*length
  end

  def parse(record)
    record[start-1, length]
  end
end

class Record
  attr_reader :fields
  attr_accessor :errors

  def [](key)
    raise IndexError, key if not self.class.field_definitions.has_key?(key)
    @fields.[](key)
  end

  def []=(key, value)
    raise IndexError, key if not self.class.field_definitions.has_key?(key)
    @fields.[]=(key, value)
  end

  def insert(key, name, value)
    raise IndexError, key if not self.class.field_definitions.has_key?(key)
    @fields.[]=(key, value)
    self.class.field_definitions[key].insert('!'*79+"\r\n", value) do |err|
      @errors << [name, err]
    end
  end

  def to_s
    record = '!'*79+"\r\n"
    self.class.field_definitions.each do |k, field|
      record = field.insert(record, @fields[k]) do |err|
        @errors << [k, err]
      end
    end
    record
  end

  def parse(record)
    record=record.rstrip+' '*79
    @errors = []
    self.class.field_definitions.each {|k, field|
      @fields[k] = field.parse(record)
      if field.spec[:value] && @fields[k] != field.spec[:value]
        raise InvalidValue, record[field.start-1, field.length]
      end
    }
    self
  end

  def initialize(err = nil)
    @fields = OrderedHash.new
    @errors = []
    @errors << err if err
  end

  def set_field!(field, value)
    self[field] = value
    self
  end

  @@record_types = {}

  def self.register
    @@record_types[self.field_definitions['Transaction Identifier'].spec[:value]+self.field_definitions['Record Identification'].spec[:value]] = self
  end

  def self.record_types
    @@record_types
  end

  def self.process_batch(batch)
    batch.split("\n").map {|record|
      if @@record_types.include?(record[0..2])
        @@record_types[record[0..2]].new.parse(record)
      else
        raise InvalidValue, record[0..2]
      end
    }
  end

  def display?(field)
    self.class.field_definitions[field].display
  end
end

class BatchHeaderRecord < Record
  @@field_definitions =
    OrderedHash['Transaction Identifier',         A.new(1, 2, true, false, :value => 'HE'),
                 'Record Identification' ,        A.new(3, 1, true, false, :value => 'B'),
                 'Tech Spec Release Identifier' , X.new(4, 3, true, false, :value => 'V03'), 
                 'MOH Office Code' ,              A.new(7, 1, true, false, :default => 'D'),
                 'Batch Creation Date' ,          D.new(8, 8, true, true, :default => Date.today),
                 'Batch Identification Number' ,  N.new(16, 4, true, true, :default => 0),
                 'Operator Number' ,              N.new(20, 6, true, true, :default => 0),
                 'Group Number' ,                 X.new(26, 4, true, true, :default => '0000'),
                 'Health Care Provider' ,         N.new(30, 6, true, true),
                 'Specialty' ,                    N.new(36, 2, true, true, :default => 0),
                 'Reserved' ,                     S.new(38, 42, false, false)]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class ClaimHeaderRecord < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, true, false, :value => 'HE'),
    'Record Identification' ,        A.new(3, 1, true, false, :value => 'H'),
    'Health Number' ,                N.new(4, 10, false, true),
    'Version Code' ,                 A.new(14, 2, false, true),
    "Patient's Birthdate" ,          D.new(16, 8, false, true),
    'Accounting Number' ,            N.new(24, 8, true, true),
    'Payment Program' ,              A.new(32, 3, true, true, :default => 'HCP'),
    'Payee' ,                        A.new(35, 1, true, true, :default => 'P'),
    'Referring Health Care Provider Number' , N.new(36, 6, false, true),
    'Master Number' ,                X.new(42, 4, false, true),
    'In-Patient Admission Date' ,    D.new(46, 8, false, true),
    'Referring Laboratory License Number' , N.new(54, 4, false, true),
    'Manual Review Indicator' ,      A.new(58, 1, false, true),
    'Service Location Indicator' ,   X.new(59, 4, false, true),
    'Reserved for OOC' ,             S.new(63, 11, false, false),
    'Reserved for MOH Use' ,         S.new(74, 6, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class ClaimHeaderRMBRecord < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, true, false, :value => 'HE'),
    'Record Identification' ,        A.new(3, 1, true, false, :value => 'R'),
    'Registration Number' ,          X.new(4, 12, true, true),
    "Patient's Last Name" ,          A.new(16, 9, true, true),
    "Patient's First Name" ,         A.new(25, 5, true, true),
    "Patient's Sex" ,                N.new(30, 1, true, true),
    "Province Code" ,                A.new(31, 2, true, true),
    "Reserved for MOH Use" ,         S.new(33, 47, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class ItemRecord < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, true, false, :value => 'HE'),
    'Record Identification' ,        A.new(3, 1, true, false, :value => 'T'),
    'Service Code' ,                 X.new(4, 5, true, true),
    'Reserved for MOH Use A' ,       S.new(9, 2, false, false),
    'Fee Submitted' ,                N.new(11, 6, true, true),
    'Number of Services' ,           N.new(17, 2, true, true),
    'Service Date' ,                 D.new(19, 8, true, true),
    'Diagnostic Code A' ,              N.new(27, 3, false, true),
    'Diagnostic Code B' ,              N.new(30, 1, false, true),
    'Reserved for OOC' ,             S.new(31, 10, false, false),
    'Reserved for MOH Use B' ,         S.new(41, 1, false, false),
    'Service Code 2' ,                 X.new(42, 5, false, true),
    'Reserved for MOH Use A2' ,        S.new(47, 2, false, false),
    'Fee Submitted 2' ,                N.new(49, 6, false, true),
    'Number of Services 2' ,           N.new(55, 2, false, true),
    'Service Date 2' ,                 D.new(57, 8, false, true),
    'Diagnostic Code 2A' ,              N.new(65, 3, false, true),
    'Diagnostic Code 2B' ,              N.new(68, 1, false, true),
    'Reserved for OOC 2' ,             S.new(69, 10, false, false),
    'Reserved for MOH Use B2' ,        S.new(79, 1, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class BatchTrailerRecord < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, true, false, :value => 'HE'),
    'Record Identification' ,        A.new(3, 1, true, false, :value => 'E'),
    'H Count' ,                      N.new(4, 4, true, true, :default => 0),
    'R Count' ,                      N.new(8, 4, true, true, :default => 0),
    'T Count' ,                      N.new(12, 5, true, true, :default => 0),
    'Reserved for MOH Use' ,         S.new(17, 63, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class ReconciliationFileHeader < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '1'),
    'Tech Spec Release Identifier' , X.new(4, 3, false, false, :value => 'V03'),
    'Reserved for MOH Use A' ,       X.new(7, 1, false, false, :default => '0'),
    'Group Number' ,                 X.new(8, 4, true, true),
    'Health Care Provider' ,         N.new(12, 6, true, true),
    'Specialty' ,                    X.new(18, 2, true, true),
    'MOH Office Code' ,              A.new(20, 1, true, true),
    'Remittance Advice Data Sequence' , N.new(21, 2, true, true),
    'Payment Date' ,                 D.new(22, 8, true, true),
    'Payee Last Name' ,              X.new(30, 25, true, true),
    'Payee Title' ,                  X.new(55, 3, true, true),
    'Payee Initials' ,               X.new(58, 2, true, true),
    'Total Amount Payable' ,         C.new(60, 9, true, true, :sign => 69),
    'Cheque Number' ,                X.new(70, 8, true, true),
    'Reserved for MOH Use B' ,       S.new(78, 2, false, false)
  ]
 
  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ReconciliationAddressRecordOne < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '2'),
    'Billing Agent\'s Name' ,        X.new(4, 30, true, true),
    'Address Line One' ,             X.new(34, 25, true, true),
    'Reserved for MOH Use' ,         S.new(59, 21, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ReconciliationAddressRecordTwo < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '3'),
    'Address Line Two' ,             X.new(4, 25, true, true),
    'Address Line Three' ,           X.new(29, 25, true, true),
    'Reserved for MOH Use' ,         S.new(54, 26, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class ReconciliationClaimHeader < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '4'),
    'Claim Number' ,                 X.new(4, 11, true, true),
    'Transaction Type' ,             N.new(15, 1, true, true),
    'Health Care Provider' ,         N.new(16, 6, true, true),
    'Specialty' ,                    N.new(22, 2, true, true),
    'Accounting Number' ,            X.new(24, 8, true, true),
    'Patient\'s Last Name' ,         A.new(32, 14, true, true),
    'Patient\'s First Name' ,        A.new(46, 5, true, true),
    'Province Code' ,                A.new(51, 2, true, true),
    'Health Registration Number' ,   X.new(53, 12, true, true),
    'Version Code' ,                 A.new(65, 2, true, true),
    'Payment Program' ,              A.new(67, 3, true, true),
    'Location Code' ,                N.new(70, 4, true, true),
    'MOH Group Identifier' ,         X.new(74, 4, true, true),
    'Reserved for MOH Use' ,         S.new(78, 2, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end

  self.register
end

class ReconciliationClaimItemHeader < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '5'),
    'Claim Number' ,                 X.new(4, 11, true, true),
    'Transaction Type' ,             N.new(15, 1, true, true),
    'Service Date' ,                 D.new(16, 8, true, true),
    'Number of Services' ,           N.new(24, 2, true, true),
    'Service Code' ,                 X.new(26, 5, true, true),
    'Reserved for MOH Use A' ,       S.new(31, 1, false, false),
    'Amount Submitted' ,             N.new(32, 6, true, true),
    'Amount Paid' ,                  N.new(38, 6, true, true, :sign => 44),
    'Explanatory Code' ,             X.new(45, 2, true, true),
    'Reserved for MOH Use B' ,       S.new(47, 33, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ReconciliationBalanceForward < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '6'),
    'Amount Brought Forward - Claim\'s Adjustment'      , N.new(4, 9, true, true, :sign => 13),
    'Amount Brought Forward - Advances'                 , N.new(14, 9, true, true, :sign => 23),
    'Amount Brought Forward - Reductions'               , N.new(24, 9, true, true, :sign => 33),
    'Amount Brought Forward - Other Deductions'         , N.new(34, 9, true, true, :sign => 43),
    'Reserved for MOH Use B' ,       S.new(44, 36, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ReconciliationAccountingTransaction < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '7'),
    'Transaction Code' ,             X.new(4, 2, true, true),
    'Cheque Indicator' ,             X.new(6, 1, true, true),
    'Transaction Date' ,             D.new(7, 8, true, true),
    'Transaction Amount',            C.new(15, 8, true, true, :sign => 23),
    'Transaction Message' ,          X.new(24, 50, true, true),
    'Reserved for MOH Use B' ,       S.new(74, 6, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ReconciliationMessageFacility < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HR'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '8'),
    'Message Text' ,                 X.new(4, 70, true, true),
    'Reserved for MOH Use B' ,       S.new(74, 6, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ErrorReportHeader < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HX'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '1'),
    'Tech Spec Release Identifier' , X.new(4, 3, false, false, :value => 'V03'),
    'MOH Office Code' ,              A.new(7, 1, true, true),
    'Reserved for MOH Use A' ,       S.new(8, 10, false, false),
    'Operator Number' ,              X.new(18, 6, true, true),
    'Group Number' ,                 X.new(24, 4, true, true),
    'Provider Number' ,              N.new(28, 6, true, true),
    'Specialty Code' ,               X.new(34, 2, true, true),
    'Station Number' ,               X.new(36, 3, true, true),
    'Claim Process Date' ,           D.new(39, 8, true, true),
    'Reserved for MOH Use B' ,       S.new(47, 33, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ErrorReportClaimHeader1 < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HX'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => 'H'),
    'Health Number' ,                N.new(4, 10, true, true),
    'Version Code' ,                 A.new(14, 2, true, true),
    "Patient's Birthdate" ,          D.new(16, 8, true, true),
    'Accounting Number' ,            N.new(24, 8, true, true),
    'Payment Program' ,              A.new(32, 3, true, true),
    'Payee' ,                        A.new(35, 1, true, true),
    'Referring Health Care Provider Number' , N.new(36, 6, true, true),
    'Master Number' ,                X.new(42, 4, true, true),
    'In-Patient Admission Date' ,    D.new(46, 8, false, true),
    'Referring Laboratory License Number' , N.new(54, 4, true, true),
    'Service Location Indicator' ,   X.new(58, 4, true, true),
    'Reserved for MOH Use' ,         S.new(62, 3, false, false),
    'Error Code 1' ,                 X.new(65, 3, true, true),
    'Error Code 2' ,                 X.new(68, 3, true, true),
    'Error Code 3' ,                 X.new(71, 3, true, true),
    'Error Code 4' ,                 X.new(74, 3, true, true),
    'Error Code 5' ,                 X.new(77, 3, true, true)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end


class ErrorReportClaimHeaderRMB < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HX'),
    'Record Identification' ,        A.new(3, 1, false, false, :value => 'R'),
    'Registration Number' ,          X.new(4, 12, true, true),
    "Patient's Last Name" ,          A.new(16, 9, true, true),
    "Patient's First Name" ,         A.new(25, 5, true, true),
    "Patient's Sex" ,                N.new(30, 1, true, true),
    "Province Code" ,                A.new(31, 2, true, true),
    "Reserved for MOH Use" ,         S.new(33, 32, false, false),
    'Error Code 1' ,                 X.new(65, 3, true, true),
    'Error Code 2' ,                 X.new(68, 3, true, true),
    'Error Code 3' ,                 X.new(71, 3, true, true),
    'Error Code 4' ,                 X.new(74, 3, true, true),
    'Error Code 5' ,                 X.new(77, 3, true, true)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ErrorReportItem < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HX'),
    'Record Identification' ,        A.new(3, 1, false, false, :value => 'T'),
    'Service Code' ,                 X.new(4, 5, true, true),
    'Reserved for MOH Use A' ,       S.new(9, 2, false, false),
    'Fee Submitted' ,                N.new(11, 6, true, true),
    'Number of Services' ,           N.new(17, 2, true, true),
    'Service Date' ,                 D.new(19, 8, true, true),
    'Diagnostic Code' ,              X.new(27, 4, true, true),
    'Reserved for MOH Use B' ,       S.new(31, 32, false, false),
    'Explanatory Code' ,             X.new(63, 2, true, true),
    'Error Code 1' ,                 X.new(65, 3, true, true),
    'Error Code 2' ,                 X.new(68, 3, true, true),
    'Error Code 3' ,                 X.new(71, 3, true, true),
    'Error Code 4' ,                 X.new(74, 3, true, true),
    'Error Code 5' ,                 X.new(77, 3, true, true)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end


class ErrorReportExplanationCodeMessage < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HX'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '8'),
    'Explanatory Code' ,             X.new(4, 2, true, true),
    'Explanatory Description' ,      X.new(6, 55, true, true),
    'Reserved for MOH Use B' ,       S.new(61, 19, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class ErrorReportTrailer < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HX'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '9'),
    'Header 1 Count' ,               N.new(4, 7, true, true),
    'Header 2 Count' ,               N.new(11, 7, true, true),
    'Item Count' ,                   N.new(18, 7, true, true),
    'Message Count' ,                N.new(25, 7, true, true),
    'Reserved for MOH Use' ,         S.new(32, 48, false, false)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class BatchEditReportRecord < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 2, false, false, :value => 'HB'),
    'Record Identification' ,        X.new(3, 1, false, false, :value => '1'),
    'Tech Spec Release Identifier' , X.new(4, 3, false, false, :value => 'V03'),
    'Batch Number' ,                 X.new(7, 5, true, true),
    'Operator Number' ,              X.new(12, 6, true, true),
    'Batch Creation Date' ,          D.new(18, 8, true, true),
    'Batch Sequence Number' ,        N.new(26, 4, true, true),
    'Micro Start' ,                  X.new(30, 11, true, true),
    'Micro End' ,                    X.new(41, 5, true, true),
    'Micro Type' ,                   X.new(46, 7, true, true),
    'Group Number' ,                 N.new(53, 4, true, true),
    'Provider Number' ,              N.new(57, 6, true, true),
    'Number of Claims' ,             N.new(63, 5, true, true),
    'Number of Records' ,            N.new(68, 6, true, true),
    'Batch Process Date' ,           D.new(74, 8, true, true),
    'Edit Message' ,                 X.new(82, 40, true, true),
    'Reserved for MOH Use' ,         X.new(122, 11, true, true)
  ]

  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class RejectMessageRecord1 < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 1, false, false, :value => 'M'),
    'Record Identification' ,        X.new(2, 2, false, false, :value => '01'),
    'Message' ,                      X.new(4, 73, true, true)
  ]  
  
  def self.field_definitions
    @@field_definitions
  end
  self.register
end

class RejectMessageRecord2 < Record
  @@field_definitions = OrderedHash[
    'Transaction Identifier' ,       A.new(1, 1, false, false, :value => 'M'),
    'Record Identification' ,        X.new(2, 2, false, false, :value => '02'),
    'Filler 1' ,                     X.new(4, 5, false, false, :value => 'FILE:'),
    'Provider File Name' ,           X.new(9, 12, true, true),
    'Filler 2' ,                     X.new(21, 5, false, false, :value => 'DATE:'),
    'Mail File Date' ,               D.new(26, 8, true, true),
    'Filler 3' ,                     X.new(34, 5, false, false, :value => 'TIME:'),
    'Mail File Time' ,               X.new(39, 6, true, true),
    'Filler 4' ,                     X.new(45, 6, false, false, :value => 'PDATE:'),
    'Process Date' ,                 D.new(51, 8, true, true)
  ]  
  
  def self.field_definitions
    @@field_definitions
  end
  self.register
end
