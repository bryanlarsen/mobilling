import EmptyHeader from './EmptyHeader';
import ProfileCommon from './ProfileCommon';
import ClaimInputGroup from './ClaimInputGroup';
import ClaimFormGroup from './ClaimFormGroup';
import DoctorProfile from './DoctorProfile';
import { connect } from 'react-redux';
import { newUser, userChangeHandler } from '../actions/userActions';
import { pushState } from 'redux-router';
import { bindActionCreators } from 'redux';

export default connect(
  (state) => state,
)(class NewUserPage extends React.Component {
  submit(ev) {
    ev.preventDefault();
    this.props.dispatch(newUser((user) => {
      if (user.role === 'agent') {
        window.location.href = '/admin';
      } else {
        this.props.dispatch(pushState(null, '/login'));
      }
    }));
  }

  render() {
    const user = this.props.userStore;
    const onChange = userChangeHandler.bind(null, this.props.dispatch);
    return (
      <div className="body">
        <EmptyHeader {...this.props} />

        <div className="container with-bottom">
          <div className="form-horizontal">

            <legend>Create Account</legend>

            <ProfileCommon {...this.props} onChange={onChange} />

            <ClaimInputGroup type="password" store={user} label="Password" name="password" onChange={onChange} />
            <ClaimInputGroup type="password" store={user} label="Password Confirmation" name="password_confirmation" onChange={onChange} />

            { user.role === 'doctor' && <DoctorProfile {...this.props} onChange={onChange} /> }

            <ClaimFormGroup label="">
              <button className="btn btn-default btn-primary" onClick={this.submit.bind(this)}>Submit</button>
            </ClaimFormGroup>
          </div>
        </div>
      </div>
    );
  }
});
