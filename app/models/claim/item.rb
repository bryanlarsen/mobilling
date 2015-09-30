class Claim::Item < ActiveRecord::Base
  belongs_to :claim, inverse_of: :items
  has_many :rows, inverse_of: :item
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
end
