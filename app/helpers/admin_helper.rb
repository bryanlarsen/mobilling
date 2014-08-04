module AdminHelper
  def sortable_link_to(column, title = column.titleize)
    title = "&#9652;&nbsp;#{title}" if column == sort_column and sort_direction == "asc"
    title = "&#9662;&nbsp;#{title}" if column == sort_column and sort_direction == "desc"
    direction = (column == sort_column and sort_direction == "asc") ? "desc" : "asc"
    link_to title.html_safe, params.merge(sort: column, direction: direction)
  end
end
