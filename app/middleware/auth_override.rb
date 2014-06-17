class AuthOverride
  AUTH_OVERRIDE_PARAM_KEY = "auth"

  def initialize(app)
    @app = app
  end

  def call(env)
    request = ActionDispatch::Request.new(env)
    token = request.query_parameters[AUTH_OVERRIDE_PARAM_KEY] || request.request_parameters[AUTH_OVERRIDE_PARAM_KEY]
    env["HTTP_AUTHORIZATION"] = "Token #{token}" if token.present?
    @app.call(env)
  end
end
