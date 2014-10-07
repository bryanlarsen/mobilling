class PremiumForm
  include ActiveModel::Model

  attr_accessor :interactor, :code, :fee, :units, :premiums

  validates :code, type: {is_a: String}, allow_nil: true

#  validates :fee, type: {is_a: Integer}
#  validates :units, type: {is_a: Integer}

  def submitted?
    interactor.present? and interactor.submitted?
  end

  def simplified?
    interactor.present? and interactor.simplified?
  end

  def as_json
    super(only: %w[code fee units])
  end
end
