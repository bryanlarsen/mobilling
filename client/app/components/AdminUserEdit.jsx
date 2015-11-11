import ProfileCommon from '../components/ProfileCommon';
import DoctorProfile from '../components/DoctorProfile';
import ClaimFormGroup from '../components/ClaimFormGroup';
import { userChangeHandler } from '../actions';
import { connect } from 'react-redux';

export default connect((state) => state)(
class AdminUserEdit extends React.Component {
  back(ev) {
    ev.preventDefault();
    history.back();
  }

  render() {
    console.log('AdminUserEdit');
    const handleChange = userChangeHandler.bind(null, this.props.dispatch);
    return (
      <div className="form-horizontal">
        <ProfileCommon {...this.props} onChange={handleChange} />

        { this.props.userStore.role === 'doctor' && <DoctorProfile {...this.props} onChange={handleChange} /> }

        <ClaimFormGroup label="">
          { this.props.globalStore.busy ?
             <button className="btn btn-default btn-danger" disabled>Unsaved</button> :
             <button className="btn btn-default btn-primary" disabled>Saved</button>
          }
           &nbsp;or <a href="#" onClick={this.back}>Cancel</a>
        </ClaimFormGroup>
      </div>
    );
  }
});
