const React = require('react-native');
const { Navigator, View } = React;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux/native');
import * as claimActions from '../actions/claimActions';
import * as globalActions from '../actions/globalActions';
import * as userActions from '../actions/userActions';

const styles = require('./styles');
const LoginScreen = require('./LoginScreen.jsx');
const ClaimsScreen = require('./ClaimsScreen.jsx');
const ClaimScreen = require('./ClaimScreen.jsx');
const Toolbar = require('./Toolbar.jsx');

class AppUnConnected extends React.Component{
  constructor(props) {
    super(props);
  }

  renderScene(route, navigator) {
    console.log('renderScene', route);
    switch(route.screen) {
      case 'Login':
        return <LoginScreen {...this.props} navigator={navigator} />;
      case 'Claims':
        return <ClaimsScreen {...this.props} navigator={navigator} />
      case 'Claim':
        return <ClaimScreen {...this.props} id={route.id} navigator={navigator} />
    }
  }

  render() {
    return  <Navigator
      style={styles.container}
      ref="nav"
      initialRoute={{ screen: 'Login' }}
      renderScene={this.renderScene.bind(this)}
    />;
  }
};

module.exports = connect(
  (state) => state,
  (dispatch) => ({
    actions: bindActionCreators({
        ...claimActions,
        ...userActions,
      ...globalActions
    }, dispatch),
    dispatch
  })
)(AppUnConnected);
