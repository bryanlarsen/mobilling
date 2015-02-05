class PremiumForm
  include ActiveModel::Model
  include Virtus.model
  include ValidationScopes

  def self.all_params
    return [
            [:uuid, String],
            [:code, String],
            [:fee, Integer],
            [:paid, Integer],
            [:units, Integer],
            [:message, String],
           ]
  end

  all_params.each do |name, type|
    attribute name, type
  end

  validates :code, type: {is_a: String}, allow_nil: true
  validation_scope :warnings do |s|
    s.validates :code, format: {with: /\A[A-Za-z]\d{3}/}
    s.validates :fee, :units, type: {is_a: Integer}, presence: true
  end

  def uuid
    @uuid ||= SecureRandom.uuid
  end

  def as_json(options = nil)
    attributes
  end
end
