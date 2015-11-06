/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  WebView,
} = React;
const { bindActionCreators } = require('redux');
const { Provider, connect } = require('react-redux/native');
const createStore = require('./native-store');
var WebViewBridge = require('react-native-webview-bridge');

window.ENV = {
  API_ROOT: 'http://192.168.1.99:4000/',
  CORDOVA: false,
}

const LoginFrame = React.createClass({
  render() {
    return <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
    ref="email"
    style={{height:40, borderColor: 'gray', borderWidth: 1}}
    onChangeText={(text) => this.props.actions.updateUserAttributes({email: text})}
    value={this.props.userStore.email}
    onSubmitEditing={() => this.refs.password.focus()}
    returnKeyType="go"
      />
      <Text>{this.props.userStore.errors && this.props.userStore.errors.email}</Text>
      <Text>Password</Text>
      <TextInput
    ref="password"
    style={{height:40, borderColor: 'gray', borderWidth: 1}}
    onChangeText={(text) => this.props.actions.updateUserAttributes({password: text})}
    value={this.props.userStore.password}
    secureTextEntry={true}
    returnKeyType="go"
    onSubmitEditing={() => {this.props.actions.logIn();}}
      />
      <Text>{this.props.userStore.errors && this.props.userStore.errors.password}</Text>
    </View>;
  }
});

var AppUnConnected = React.createClass({
  componentDidMount() {
    var ref = this.refs.webview;
    var claim = {"id":"7d70acfd-3721-4acc-8add-6c01a9bed8bc","user_id":"a6242a0d-0e81-4dbb-9395-f3ae798ae2da","photo_id":null,"created_at":"2015-05-27T16:01:33.933Z","updated_at":"2015-10-12T16:28:32.360Z","number":2,"original_id":null,"submitted_fee":0,"paid_fee":0,"specialty":"family_medicine","patient_name":"","patient_number":"","patient_province":"ON","patient_birthday":null,"patient_sex":"F","hospital":null,"referring_physician":null,"most_responsible_physician":false,"admission_on":null,"first_seen_on":null,"first_seen_consult":false,"last_seen_on":null,"last_seen_discharge":false,"icu_transfer":false,"consult_type":null,"consult_time_in":null,"consult_time_out":null,"consult_premium_visit":null,"consult_premium_first":false,"consult_premium_travel":false,"referring_laboratory":null,"payment_program":null,"payee":null,"manual_review_indicator":false,"service_location":null,"last_code_generation":null,"diagnoses":[],"items":[],"errors":{},"photo":{"small_url":null,"url":null},"comments":[],"num_comments":0,"files":{},"service_date":null,"consult_setup_visible":true,"consult_tab_visible":false,"consult_premium_visit_count":null,"consult_premium_first_count":null,"consult_premium_travel_count":null,"status":"saved", "warnings":{"patient_number":["invalid value for Integer(): \"\"","can't be blank","must be 10 digits + 0-2 characters","invalid value for Integer(): \"\""],"patient_name":["must contain first and last name"],"hospital":["can't be blank","is invalid"],"patient_birthday":["can't be blank"],"items":["is too short (minimum is 1 character)"],"admission_on":["can't be blank"],"first_seen_on":["can't be blank"],"last_seen_on":["can't be blank"],"consult_type":["is not included in the list"],"Health Number":["invalid value for Integer(): \"\""]},"submission":"HEH!!!!!!!!!!          00000002HCPP                                            \r\n"};
    ref.onMessage((message) => {
      try {
        var action = JSON.parse(atob(message));
        console.log('action', action);
        if (action.type === 'CLAIM.UPDATE') {
          claim = {...claim, ...action.payload};
        }
        console.log(claim);
        ref.send(btoa(JSON.stringify({
          component: 'NativePatientPage',
          claim: claim
        })));
      } catch(e) {
        console.log('uknown message', message);
      }
    });

    console.log('injecting');
    ref.injectBridgeScript();
  },

  render: function() {
//    if (!this.props.userStore.id) return <LoginFrame {...this.props} />;
    return <WebViewBridge ref="webview" style={{flex:1}} url="web/foo.html" />;
  }
});

var App = connect((state) => state, (dispatch) => {return {actions: bindActionCreators(require('./actions'), dispatch)}})(AppUnConnected);

const BillOHIP = React.createClass({
  render: function() {
    const store = createStore(this.props);
    console.log(store.getState());
    return <Provider store={store}>
      {() => <App/>}
    </Provider>;
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('BillOHIP', () => BillOHIP);
