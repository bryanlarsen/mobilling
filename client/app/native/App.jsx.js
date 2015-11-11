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
const Toolbar = require('./Toolbar.jsx');

class AppUnConnected extends React.Component{
  constructor(props) {
    super(props);
  }

/*
  componentWillReceiveProps(nextProps) {
    if (nextProps.nativeRouter.route !== this.props.nativeRouter.route) {
      this.refs.nav.push(nextProps.nativeRouter.route);
    }
    } */

  renderScene(route, navigator) {
    console.log('renderScene', route);
    switch(route.screen) {
      case 'Login':
        return <LoginScreen {...this.props} navigator={navigator} />;
      case 'Claims':
        return <View style={styles.container}>
          <Toolbar title="Claims"/>
          <ClaimsScreen {...this.props} navigator={navigator} />
        </View>;
      case 'Claim':
        return <View style={styles.container}>
          <Toolbar title={route.id} />
        </View>;
    }
  }

  render() {
    return  <Navigator
      style={styles.container}
      ref="nav"
      initialRoute={{ screen: 'Login' }}
      renderScene={this.renderScene.bind(this)}
    />;
    return <View style={styles.container}>
      <Toolbar
        title="Hello"
      />
      </View>;
    return <View>
      <WebViewBridge style={this.props.nativeRouter.component ? styles.hidden : styles.full} ref="webview" url="web/foo.html" />
      {this.props.nativeRouter.component && React.createElement(this.props.nativeRouter.component, {...this.props, style: styles.full})}
      {this.props.nativeRouter.tabbar && React.createElement(this.props.nativeRouter.tabbar, {...this.props, ...this.props.nativeRouter.tabbarProps})}
    </View>;

    // never gets here
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
