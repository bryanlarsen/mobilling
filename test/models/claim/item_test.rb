require "test_helper"

class Claim::ItemTest < ActiveSupport::TestCase
  setup do
    create(:service_code, code: 'P018B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'P018A', fee: 7224, requires_diagnostic_code: true)
    create(:service_code, code: 'E401B', fee: 903, requires_diagnostic_code: false)
    create(:service_code, code: 'E676B', fee: 7224, requires_diagnostic_code: false)
    create(:service_code, code: 'C999B', fee: 10000, requires_diagnostic_code: false)
  end

  def test_warnings
    item = build(:item, day: Date.new(2014,8,11), rows: [build(:row, code: 'P018A')])
    assert item.has_warnings?
    assert item.warnings.has_key?(:diagnosis)
    assert_equal 1, item.warnings.count
  end
end
