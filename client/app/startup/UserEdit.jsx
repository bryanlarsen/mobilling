const React = require('react');
const { Provider, connect } = require('react-redux');
const { AdminUserEdit } = require('../components');

const createStore = require('../admin-store');

const UserEdit = props => {
  console.log('UserEdit');
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store}>
      {() => <AdminUserEdit/>}
    </Provider>
  );
  return reactComponent;
};

module.exports = UserEdit;
