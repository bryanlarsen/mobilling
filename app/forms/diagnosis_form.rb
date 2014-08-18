class DiagnosisForm
  include ActiveModel::Model

  attr_accessor :interactor, :name

  validates :name, type: {is_a: String}, allow_nil: true
  validates :name, presence: true, if: :submitted?

  def submitted?
    interactor.present? and interactor.submitted?
  end

  def as_json
    super(only: %w[name])
  end
end
