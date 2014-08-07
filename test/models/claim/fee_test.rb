require "test_helper"

class Claim::FeeTest < ActiveSupport::TestCase
  setup do
    [ ['R441B',  9632],
      ['R441A', 61990],
      ['R441C', 12008],
      ['E676B',  7224],
      ['C998B',  6000],
    ].each do |code, fee|
      create(:service_code, code: code, fee: BigDecimal.new(fee)/100)
    end
  end

  test "code fixture ok" do
    assert ServiceCode.find_by(code: 'R441B').fee == BigDecimal.new("96.32")
  end

  test "fees" do
    #  'code'  min   u   $$$CC
    [
     ['R441B',  0,  8,   9632],
     ['E676B',  0,  6,   7224],
     ['R441A',  0,  1,  61990],
     ['R441C',  0,  8,  12008],
     ['R441B',  1,  9,  10836],
     ['R441B', 15,  9,  10836],
     ['R441B', 16, 10,  12040],
     ['R441B', 60, 12,  14448],
     ['R441B', 61, 14,  16856],
     ['R441B',150, 24,  28896],
     ['R441B',151, 27,  32508],
     ['R441B',299, 54,  65016],
     ['C998B',  0,  1,   6000],
     ['R441C',  1,  9,  13509],
     ['R441C', 15,  9,  13509],
     ['R441C', 16, 10,  15010],
     ['R441C', 60, 12,  18012],
     ['R441C', 61, 14,  21014],
     ['R441C', 90, 16,  24016],
     ['R441C', 91, 19,  28519],
     ['R441C',299, 58,  87058],
    ].each do |code, minutes, units, fee|
      fee = BigDecimal.new(fee)/100
      sc = ServiceCode.find_by(code: code)
      _fee, _units = Claim.fee_and_units(Date.new(2014,8,8), code, minutes, sc.fee)
      assert _units == units, _units.to_s + " was expected to be " + units.to_s
      assert _fee == fee, _fee.to_s + " was expected to be " + fee.to_s
    end
  end
end