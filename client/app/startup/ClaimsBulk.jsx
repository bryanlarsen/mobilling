import React from 'react';
import { Provider, connect } from 'react-redux';
import { AdminClaimsBulk } from '../components';

import createStore from '../admin-store';

const ClaimsBulk = props => {
  const store = createStore(props);
  const reactComponent = (
    <Provider store={store}>
      {() => <AdminClaimsBulk/>}
    </Provider>
  );
  return reactComponent;
};

export default ClaimsBulk;
