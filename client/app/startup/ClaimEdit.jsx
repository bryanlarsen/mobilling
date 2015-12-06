import React from 'react';
import { Provider, connect } from 'react-redux';
import AdminClaimEdit from '../components/AdminClaimEdit';

import createStore from '../admin-store';

const ClaimEdit = props => {
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store}>
      {() => <AdminClaimEdit/>}
    </Provider>
  );
  return reactComponent;
};

export default ClaimEdit;
