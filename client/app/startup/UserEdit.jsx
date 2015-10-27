import React from 'react';
import { Provider, connect } from 'react-redux';
import { AdminUserEdit } from '../components';

import createStore from '../admin-store';

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

export default UserEdit;
