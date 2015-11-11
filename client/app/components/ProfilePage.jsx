import _ from 'underscore';
import ProfileHeader from './ProfileHeader';
import ProfileSettings from './ProfileSettings';
import { connect } from 'react-redux';
import { userChangeHandler } from '../actions/userActions';

export default connect((state) => state)(
class ProfilePage extends React.Component {
  render() {
    return (
      <div className="body">
        <ProfileHeader {..._.pick(this.props, 'dispatch', 'globalStore', 'userStore')} />

        <div className="container with-bottom">
          {React.cloneElement(this.props.children, {..._.pick(this.props, 'dispatch', 'userStore'), onChange: userChangeHandler.bind(null, this.props.dispatch)})}
        </div>
      </div>
    );
  }
});
