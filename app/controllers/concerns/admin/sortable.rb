module Admin::Sortable
  extend ActiveSupport::Concern

  included do
    cattr_accessor :sortable_columns
    helper_method :sort_column, :sort_direction, :sort_column_name
    self.sortable_columns = %w[id]
  end

  def sort_column_pair
    sort = params[:sort]
    if sortable_columns.is_a? Hash
      sortable_columns.assoc(sort) || sortable_columns.first
    elsif sortable_columns.include?(sort)
      [sort, sort]
    else
      [sortable_columns.first, sortable_columns.first]
    end
  end

  def sort_column
    ActiveSupport::StringInquirer.new(sort_column_pair.last)
  end

  def sort_column_name
    sort_column_pair.first
  end

  def sort_direction
    direction = params[:direction]
    direction = "asc" unless %w[asc desc].include?(direction)
    ActiveSupport::StringInquirer.new(direction)
  end
end
