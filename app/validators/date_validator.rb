class DateValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    Date.parse(value)
  rescue ArgumentError
    record.errors.add attribute, :invalid
  end
end
