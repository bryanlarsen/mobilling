module Admin::Sortable
  extend ActiveSupport::Concern

  included do
    cattr_accessor :sortable_columns
    helper_method :sort_column, :sort_direction
    self.sortable_columns = %w[id]
  end

  def sort_column
    sort = params[:sort]
    sort = sortable_columns.first unless sortable_columns.include?(sort)
    ActiveSupport::StringInquirer.new(sort)
  end

  def sort_direction
    direction = params[:direction]
    direction = "asc" unless %w[asc desc].include?(direction)
    ActiveSupport::StringInquirer.new(direction)
  end
end
