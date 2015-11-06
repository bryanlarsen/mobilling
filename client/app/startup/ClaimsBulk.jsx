const React = require('react');
const { Provider, connect } = require('react-redux');
const { AdminClaimsBulk } = require('../components');

const createStore = require('../admin-store');

const ClaimsBulk = props => {
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store}>
      {() => <AdminClaimsBulk/>}
    </Provider>
  );
  return reactComponent;
};

module.exports = ClaimsBulk;
