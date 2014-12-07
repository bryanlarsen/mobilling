class DiagnosisForm
  include ActiveModel::Model

  attr_accessor :name

  validates :name, type: {is_a: String}, allow_nil: true
  validates :name, presence: true, if: :submitted?

  def submitted?
    false
  end

  def as_json(options = nil)
    super(only: %w[name])
  end
end
