const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const { pushState } = require('redux-router');
const { connect } = require('react-redux');

const { startBusy, endBusy, newSession } = require('../actions');
const EmptyHeader = require('./EmptyHeader');

@connect((state) => state)
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  onSubmit = (ev) => {
    var page = this;
    ev.preventDefault();
    this.props.dispatch(startBusy());
    $.ajax({
      url: window.ENV.API_ROOT+'session.json',
      data: $(this.refs.form).serialize(),
      dataType: 'json',
      type: 'POST',
      success: function(data) {
        page.props.dispatch(endBusy());
        if (data.errors) {
          page.setState({errors: data.errors});
        } else {
          page.props.dispatch(newSession(data));
          page.props.dispatch(pushState(null, '/claims', page.props.globalStore.claimsListQuery));
        }
      },
      error: function(xhr, status, err) {
        page.props.dispatch(endBusy());
        page.setState({errors: {password: ["Server Error"]}});
        console.log("error!", xhr);
      }
    });
  }

  render() {

    return (
      <div className="body">
        <EmptyHeader {...this.props} />
        <div className="content-body container">
          <div className="row">
            <form ref="form" onSubmit={this.onSubmit}>
              <legend>BillOHIP</legend>
              <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="email">Email</label>
                <div className="col-sm-10">
                  <input className="form-control input-lg" defaultValue={this.props.userStore.email} type="email" name="v3_create_session[email]" />
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
            <Link to="/forgot_password" className="btn btn-lg btn-block">Forgot your password?</Link>
            <Link to="/create_account" className="btn btn-lg btn-block">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }
};

module.exports = LoginPage;
