import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';

import createStore from '../store';
import routes from '../routes';

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
export default App;
