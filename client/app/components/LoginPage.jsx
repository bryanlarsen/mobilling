import { Link } from 'react-router';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { logIn, userChangeHandler } from '../actions/userActions';
import EmptyHeader from './EmptyHeader';
import ClaimInputGroup from './ClaimInputGroup';

export default connect((state) => state)(
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  onSubmit = (ev) => {
    ev.preventDefault();
    this.props.dispatch(logIn(() => {
      this.props.dispatch(pushState(null, '/claims', this.props.globalStore.claimsListQuery));
    }));
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
});
