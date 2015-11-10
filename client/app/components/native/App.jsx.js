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
    var claim = {"id":"7d70acfd-3721-4acc-8add-6c01a9bed8bc","user_id":"a6242a0d-0e81-4dbb-9395-f3ae798ae2da","photo_id":null,"created_at":"2015-05-27T16:01:33.933Z","updated_at":"2015-10-12T16:28:32.360Z","number":2,"original_id":null,"submitted_fee":0,"paid_fee":0,"specialty":"family_medicine","patient_name":"","patient_number":"","patient_province":"ON","patient_birthday":null,"patient_sex":"F","hospital":null,"referring_physician":null,"most_responsible_physician":false,"admission_on":null,"first_seen_on":null,"first_seen_consult":false,"last_seen_on":null,"last_seen_discharge":false,"icu_transfer":false,"consult_type":null,"consult_time_in":null,"consult_time_out":null,"consult_premium_visit":null,"consult_premium_first":false,"consult_premium_travel":false,"referring_laboratory":null,"payment_program":null,"payee":null,"manual_review_indicator":false,"service_location":null,"last_code_generation":null,"diagnoses":[],"items":[],"errors":{},"photo":{"small_url":null,"url":null},"comments":[],"num_comments":0,"files":{},"service_date":null,"consult_setup_visible":true,"consult_tab_visible":false,"consult_premium_visit_count":null,"consult_premium_first_count":null,"consult_premium_travel_count":null,"status":"saved", "warnings":{"patient_number":["invalid value for Integer(): \"\"","can't be blank","must be 10 digits + 0-2 characters","invalid value for Integer(): \"\""],"patient_name":["must contain first and last name"],"hospital":["can't be blank","is invalid"],"patient_birthday":["can't be blank"],"items":["is too short (minimum is 1 character)"],"admission_on":["can't be blank"],"first_seen_on":["can't be blank"],"last_seen_on":["can't be blank"],"consult_type":["is not included in the list"],"Health Number":["invalid value for Integer(): \"\""]},"submission":"HEH!!!!!!!!!!          00000002HCPP                                            \r\n"};
    ref.onMessage((message) => {
      try {
        console.log('received message', message);
        var action = JSON.parse(message);
        console.log('action', action);
        if (action.type === 'CLAIM.UPDATE') {
          claim = {...claim, ...action.payload};
        }
        console.log(claim);
      } catch(e) {
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
    }
    message = JSON.stringify(message);
    if (message !== this.state.lastMessage) {
      console.log('message', message);
      var ref = this.refs.webview;
      ref.send(message);
      this.setState({lastMessage: message});
    }
  }

  render() {
    console.log('render', this.props.nativeRouter);
    return <View style={styles.container}>
      <Toolbar
        title={this.props.nativeRouter.title}
        left={this.props.nativeRouter.leftButton}
        right={this.props.nativeRouter.rightButton}
        actions={this.props.actions}
      />
      <WebViewBridge style={this.props.nativeRouter.component ? styles.hidden : styles.full} ref="webview" url="web/foo.html" />
      {this.props.nativeRouter.component && React.createElement(this.props.nativeRouter.component, {...this.props, style: styles.full})}
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
  (dispatch) => ({actions: bindActionCreators(require('../../actions'), dispatch)})
)(AppUnConnected);
