class Claim::Item < ActiveRecord::Base
  belongs_to :claim, inverse_of: :items
  has_many :rows, inverse_of: :item, class_name: 'Claim::Row'
  accepts_nested_attributes_for :rows

  default_scope { order(created_at: :asc) }

  validation_scope :warnings do |s|
    s.validate :validate_record
  end

  def any_warnings?
    has_warnings? || rows.map(&:has_warnings?).any?
  end

  def validate_record
    rows.each do |row|
      row.to_record.errors.each do |attr, err|
        if [:diagnosis, :day].include?(attr)
          warnings.add(attr, err.to_s)
        end
      end
    end
  end

  def as_json
    attributes.tap do |response|
      response['rows'] = rows.map(&:as_json)

      valid?
      response['errors'] = errors.as_json
      has_warnings?
      response['warnings'] = warnings.as_json
    end
  end
end
