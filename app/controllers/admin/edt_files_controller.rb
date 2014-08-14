class Admin::EdtFilesController < Admin::BaseController
  def create
    file = EdtFile.new_child(filename: params['contents'].original_filename,
                             user_id: params['user_id'],
                             contents: params['contents'].read)
    file.process!
    redirect_to admin_user_submissions_path(params['user_id'])
  end
end
