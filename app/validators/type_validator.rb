class TypeValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add attribute, :invalid if options.key?(:kind_of) and not value.kind_of?(options[:kind_of])
    record.errors.add attribute, :invalid if options.key?(:is_a) and not value.is_a?(options[:is_a])
  end
end
