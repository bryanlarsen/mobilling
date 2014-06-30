class TimeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    Time.parse(value)
  rescue ArgumentError
    record.errors.add attribute, :invalid
  end
end
