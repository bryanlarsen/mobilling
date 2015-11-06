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
const createStore = require('../native-store');

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
  render: function() {
//    if (!this.props.userStore.id) return <LoginFrame {...this.props} />;
    return <WebView ref="webview" style={{flex:1}} url="web/foo.html" />;
  }
});

var App = connect((state) => state, (dispatch) => {return {actions: bindActionCreators(require('../actions'), dispatch)}})(AppUnConnected);

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
