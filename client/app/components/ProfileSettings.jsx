import { Link } from 'react-router';

import { ProfileCommon, DoctorProfile } from '../components';

export default (props) => {
    return (
      <div className="form-horizontal">
        <ProfileCommon {...props} />

        <Link to="password" className="btn btn-lg btn-block">Change your Password</Link>

        { props.userStore.role === 'doctor' && <DoctorProfile {...props} /> }

      </div>
    );
};
