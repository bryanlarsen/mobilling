module ApplicationHelper
  def active_link_to_if(condition, name, options = {}, html_options = {}, &block)
    html_options[:class] = [html_options[:class], "active"].compact.join(" ") if condition
    link_to(name, options, html_options, &block)
  end

  def icon_link_to(icon, title, *args)
    link_to(*args) { content_tag("span", "", class: "fa fa-#{icon}") + "&nbsp;".html_safe + title }
  end

  def icon_submit(icon, title, options = {})
    content_tag(:button, {type: "submit"}.merge(options)) { content_tag("span", "", class: "fa fa-#{icon}") + "&nbsp;".html_safe + title }
  end
end
