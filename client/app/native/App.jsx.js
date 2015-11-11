const React = require('react-native');
const { Navigator, View } = React;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux/native');
var WebViewBridge = require('react-native-webview-bridge');
const styles = require('./styles');
const LoginFrame = require('./LoginFrame.jsx');
const ClaimsFrame = require('./ClaimsFrame.jsx');
const Toolbar = require('./Toolbar.jsx');

class AppUnConnected extends React.Component{
  constructor(props) {
    super(props);
    this.state = {lastMessage: ''};
  }

  componentDidMount() {
    var ref = this.refs.webview;
    ref.onMessage((message) => {
      try {
        var action = JSON.parse(message);
        console.log('action', action);
        console.log(this.props);
        this.props.dispatch(action);
      } catch(e) {
        console.log('exception', e);
        console.log('uknown message', message);
      }
    });

    console.log('injecting');
    ref.injectBridgeScript();
  }
/*
  componentWillReceiveProps(nextProps) {
    if (nextProps.nativeRouter.route !== this.props.nativeRouter.route) {
      this.refs.nav.push(nextProps.nativeRouter.route);
    }
  }

  renderScene(route, navigator) {
    if (!this.props.nativeRouter.component) return false;
    return React.createElement(this.props.nativeRouter.component, {...this.props, navigator});
  }
*/
  componentDidUpdate(prevProps) {
    var message = {...this.props.nativeRouter.webView};
    if (message.claimId) {
      message.claim = this.props.claimStore.claims[message.claimId]
      message.userStore = this.props.userStore
    }
    message = JSON.stringify(message);
    if (message !== this.state.lastMessage) {
      var ref = this.refs.webview;
      ref.send(message);
      this.setState({lastMessage: message});
    }
  }

  render() {
    return <View style={styles.container}>
      <Toolbar
        title={this.props.nativeRouter.title}
        left={this.props.nativeRouter.leftButton}
        right={this.props.nativeRouter.rightButton}
        actions={this.props.actions}
      />
      <WebViewBridge style={this.props.nativeRouter.component ? styles.hidden : styles.full} ref="webview" url="web/foo.html" />
      {this.props.nativeRouter.component && React.createElement(this.props.nativeRouter.component, {...this.props, style: styles.full})}
      {this.props.nativeRouter.tabbar && React.createElement(this.props.nativeRouter.tabbar, {...this.props, ...this.props.nativeRouter.tabbarProps})}
    </View>;

    // never gets here
    return  <Navigator
        style={this.props.nativeRouter.navStyle}
        ref="nav"
        initialRoute={{ path: '/login' }}
        renderScene={this.renderScene.bind(this)}
      />;
  }
};

module.exports = connect(
  (state) => state,
  (dispatch) => ({
    actions: bindActionCreators(require('../../actions'), dispatch),
    dispatch
  })
)(AppUnConnected);
