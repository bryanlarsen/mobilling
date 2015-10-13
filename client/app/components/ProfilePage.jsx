import _ from 'underscore';
import ProfileHeader from './ProfileHeader';
import ProfileSettings from './ProfileSettings';
import { connect } from 'react-redux';
import { userChangeHandler } from '../actions';

@connect((state) => state)
class ProfilePage extends React.Component {
  render() {
    return (
      <div className="body">
        <ProfileHeader {..._.pick(this.props, 'dispatch', 'globalStore', 'userStore')} />

        <div className="container with-bottom">
          <ProfileSettings {..._.pick(this.props, 'dispatch', 'userStore')} onChange={userChangeHandler.bind(null, this.props.dispatch)} />
        </div>
      </div>
    );
  }
};

export default ProfilePage;
