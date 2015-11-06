const _ = require('underscore');
const ProfileHeader = require('./ProfileHeader');
const ProfileSettings = require('./ProfileSettings');
const { connect } = require('react-redux');
const { userChangeHandler } = require('../actions');

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

module.exports = ProfilePage;
