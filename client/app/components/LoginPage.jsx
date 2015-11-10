const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const { pushState } = require('redux-router');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');

const { userChangeHandler, logIn } = require('../actions');
const { startBusy, endBusy, newSession } = require('../actions');
const EmptyHeader = require('./EmptyHeader');
const ClaimInputGroup = require('./ClaimInputGroup');

@connect((state) => state)
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  onSubmit = (ev) => {
    ev.preventDefault();
    this.props.dispatch(logIn(this.props.userStore, pushState(null, '/claims', this.props.globalStore.claimsListQuery)));
  }

  render() {
    const handler = userChangeHandler.bind(null, this.props.dispatch);
    return (
      <div className="body">
        <EmptyHeader {...this.props} />
        <div className="content-body container">
          <div className="row">
            <form ref="form" className="form-horizontal" onSubmit={this.onSubmit}>
              <legend>BillOHIP</legend>
              <ClaimInputGroup {...this.props} store={this.props.userStore} name="email" onChange={handler}/>
              <ClaimInputGroup {...this.props} store={this.props.userStore} name="password" type="password" onChange={handler}/>
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
