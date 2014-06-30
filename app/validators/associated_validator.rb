class AssociatedValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add(attribute, :invalid, options.merge(:value => value)) if Array.wrap(value).any?(&:invalid?)
  end
end
