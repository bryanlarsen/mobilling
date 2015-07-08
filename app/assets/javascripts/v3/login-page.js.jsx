var LoginPage = React.createClass({
  mixins: [
    ReactRouter.Navigation,
    Fynx.connect(globalStore, 'globalStore')
  ],

  getInitialState: function() {
    return {
      errors: {}
    };
  },

  onSubmit: function(ev) {
    var page = this;
    ev.preventDefault();
    console.log(this.refs.form);
    $.ajax({
      url: window.ENV.API_ROOT+'session.json',
      data: $(this.refs.form.getDOMNode()).serialize(),
      dataType: 'json',
      type: 'POST',
      success: function(data) {
        if (data.errors) {
          page.setState({errors: data.errors});
        } else {
          globalActions.init();
          userActions.init(data);
          page.transitionTo('claims', {}, page.state.globalStore.get('claimsListQuery').toJS());
        }
      },
      error: function(xhr, status, err) {
        page.setState({errors: {password: ["Server Error"]}});
        console.log("error!", xhr);
      }
    });
  },

  render: function() {
    return (
      <div className="body">
        <EmptyHeader/>
        <div className="content-body container">
          <div className="row">
            <form ref="form" onSubmit={this.onSubmit}>
              <legend>Mo-Billing</legend>
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="email">Email</label>
                <div className="col-sm-10">
                  <input className="form-control input-lg" type="email" name="v3_create_session[email]" />
                  <span className="help-block">{(this.state.errors.email || []).join(',')}</span>
                </div>
              </div>
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="password">Password</label>
                <div className="col-sm-10">
                  <input className="form-control input-lg" type="password" name="v3_create_session[password]" />
                  <span className="help-block">{(this.state.errors.password || []).join(',')}</span>
                </div>
              </div>
              <div className="form-group">
                <div className="col-sm-10 col-sm-offset-2">
                  <input className="btn btn-lg btn-block btn-primary" type="submit" name="submit" value="Sign In" />
                </div>
              </div>
            </form>
          </div>
          <div className="row">
            <Link to="forgot_password" className="btn btn-lg btn-block">Forgot your password?</Link>
            <Link to="create_account" className="btn btn-lg btn-block">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }
});

