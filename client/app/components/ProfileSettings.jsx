import { Link } from 'react-router';

import { ProfileCommon, DoctorProfile } from '../components';

export default React.createClass({
  render(props) {
    return (
      <div className="form-horizontal">
        <ProfileCommon {...this.props} />

        <Link to="/profile/password" className="btn btn-lg btn-block">Change your Password</Link>

        { this.props.userStore.role === 'doctor' && <DoctorProfile {...this.props} /> }

      </div>
    );
  }
});
