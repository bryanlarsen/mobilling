class PremiumForm
  include ActiveModel::Model

  attr_accessor :code, :fee, :units, :premiums

  validates :code, type: {is_a: String}, allow_nil: true

#  validates :fee, type: {is_a: Integer}
#  validates :units, type: {is_a: Integer}

  def as_json(options = nil)
    super(only: %w[code fee units])
  end
end
