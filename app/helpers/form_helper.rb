module FormHelper
  def self.included(base)
    ActionView::Helpers::FormBuilder.instance_eval { include FormBuilderMethods }
  end

  module FormBuilderMethods
    def group(attribute, options = {}, &block)
      class_names = options.fetch(:class, "").split(" ")
      class_names << "form-group"
      class_names << "has-error" if object.errors[attribute].present?
      @template.content_tag(:div, options.merge(class: class_names.join(" ")), &block)
    end

    def help_block(attribute, options = {})
      class_names = options.fetch(:class, "").split(" ")
      class_names << "help-block"
      @template.content_tag(:span, object.errors[attribute].first, options.merge(class: class_names.join(" ")))
    end
  end
end
