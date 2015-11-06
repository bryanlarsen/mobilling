const { Link } = require('react-router');

const ProfileCommon = require('./ProfileCommon');
const DoctorProfile = require('./DoctorProfile');

module.exports = (props) => {
    return (
      <div className="form-horizontal">
        <ProfileCommon {...props} />

        <Link to="password" className="btn btn-lg btn-block">Change your Password</Link>

        { props.userStore.role === 'doctor' && <DoctorProfile {...props} /> }

      </div>
    );
};
