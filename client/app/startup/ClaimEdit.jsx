const React = require('react');
const { Provider, connect } = require('react-redux');
const { AdminClaimEdit } = require('../components');

const createStore = require('../admin-store');

const ClaimEdit = props => {
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store}>
      {() => <AdminClaimEdit/>}
    </Provider>
  );
  return reactComponent;
};

module.exports = ClaimEdit;
