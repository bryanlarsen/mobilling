class V1::UsersController < V1::BaseController
  skip_before_action :require_user, only: %i[create]
  skip_before_filter :refresh_session, :only => [:create]
  wrap_parameters :user, include: User.all_params.map(&:first), format: :json
  resource_description { resource_id "users" }

  api :GET, "/v1/users", "Returns user list"
  def index
    render json: policy_scope(User).all
  end

  api :GET, "/v1/users/:id", "Returns a user"
  def show(user = nil, status = nil, notice = nil)
    user ||= User.find(params[:id])
    authorize user
    response = user.as_json(include_warnings: true)
    response[:notice] = notice unless notice.nil?
    render json: response, status: status || 200
  end

  def_param_group :user do
    param :user, Hash, required: true do
      User.all_params.each do |name, klass|
        param name, klass
      end
    end
  end

  def pundit_user
    return nil if action_name == 'create'
    current_user
  end

  api :POST, "/v1/users", "Creates a new user"
  param_group :user
  def create
    @user = User.new(user_params)
    authorize @user
    if @user.valid?
      @user.save!
      show @user, 200, 'Accounted created.  Please log in.'
    else
      show @user, 422
    end
  end

  api :PUT, "/v1/users/:id", "Updates a user"
  param_group :user
  def update
    @user = User.find(params[:id])
    authorize @user
    @user.update(user_params)
    if @user.valid?
      show @user, 200
    else
      show @user, 422
    end
  end

  private

  def user_params
    params.require(:user).permit(User.all_param_names)
  end
end
