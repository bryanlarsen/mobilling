class Admin::EdtFilesController < Admin::BaseController
  include Admin::Sortable
  self.sortable_columns = %w[filename users.name type created_at]

  helper_method :user_id_filter, :type_filter

  def index
    @edt_files = policy_scope(EdtFile).where(filters).includes(:claims, :user)
    if sort_column == "filename"
      @edt_files = @edt_files.order("edt_files.filename_base #{sort_direction}, edt_files.sequence_number #{sort_direction}")
    else
      @edt_files = @edt_files.order("#{sort_column} #{sort_direction}")
    end
  end

  def create
    begin
      file = EdtFile.new_child(filename: params['contents'].original_filename,
                               contents: params['contents'].read)
      message = file.process!
    rescue StandardError => e
      puts e.to_s
      flash[:error] = "Invalid File #{e.to_s}"
      redirect_to admin_edt_files_path
      authorize file
      return
    end
    authorize file
    unless message.blank?
      flash[:error] = message
      redirect_to admin_edt_files_path
      return
    end
    redirect_to admin_edt_file_path(file)
  end

  def download
    @file = policy_scope(EdtFile).find(params[:id])
    authorize @file, :show?
    send_data @file.contents, filename: @file.filename, disposition: 'attachment', type: 'text/plain'
  end

  def show
    @file = EdtFile.find(params[:id])
    authorize @file, :show?
  end

  private

  def user_id_filter
    if params.key?(:user_id)
      cookies[:edt_files_index_user_id_filter] = params[:user_id]
    else
      cookies[:edt_files_index_user_id_filter]
    end
  end

  def type_filter
    if params.key?(:types)
      cookies[:claims_index_type_filter] = Array.wrap(params[:types]).select(&:present?)
    else
      cookies[:claims_index_type_filter].to_s.split("&")
    end
  end

  def filters
    puts "type_filter"
    puts type_filter
    {}.tap do |filters|
      filters[:user_id] = user_id_filter if user_id_filter.present?
      filters[:type] = type_filter if type_filter.present?
    end
  end
end
