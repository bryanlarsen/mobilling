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
} = React;
import { bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux/native';
import createStore from './native-store';

window.ENV = {
  API_ROOT: 'http://localhost:4000/',
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
    if (!this.props.userStore.id) return <LoginFrame {...this.props} />;
    return (
        <View style={styles.container}>
        <Text style={styles.welcome}>
        Welcome to React Native!
      </Text>
        <Text style={styles.instructions}>
        To get started, edit index.ios.js
      </Text>
        <Text style={styles.instructions}>
        Press Cmd+R to reload,{'\n'}
      Cmd+D or shake for dev menu
      </Text>
        </View>
    );
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
