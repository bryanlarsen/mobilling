'use strict';

var React = require('react-native');
var {AppRegistry} = React;
const { Provider } = require('react-redux/native');

const createStore = require('./native-store');
const App = require('./native/App.jsx');

window.ENV = {
  API_ROOT: 'http://192.168.1.99:4000/',
  CORDOVA: false
};

const BillOHIP = React.createClass({
  render: function() {
    const store = createStore(this.props);

    return <Provider store={store}>
      {() => <App/>}
    </Provider>;
  }
});

AppRegistry.registerComponent('BillOHIP', () => BillOHIP);
