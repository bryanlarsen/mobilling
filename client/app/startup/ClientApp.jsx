const React = require('react');
const { Provider } = require('react-redux');
const { ReduxRouter } = require('redux-router');

const createStore = require('../store');
const routes = require('../routes');

const App = props => {
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store} >
      <ReduxRouter>
        {routes}
      </ReduxRouter>
    </Provider>
  );
  return reactComponent;
};

// Export is needed for the hot reload server
module.exports = App;
