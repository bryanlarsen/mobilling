import {EmptyHeader, ProfileCommon, ClaimInputGroup, ClaimFormGroup, DoctorProfile } from '../components';
import { connect } from 'react-redux';
import { userChangeHandler, newUser } from '../actions';

@connect((state) => state)
class NewUserPage extends React.Component {
  submit(ev) {
    ev.preventDefault();
    this.props.dispatch(newUser());
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
};

export default NewUserPage;
