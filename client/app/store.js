import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import createLogger from 'redux-logger';
import busyMiddleware from './middleware/busyMiddleware';

import routes from './routes';
import reducers, { initialStates } from './reducers';

export default (props) => {
  const reducer = combineReducers(reducers);
  const logger = createLogger();
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, busyMiddleware, logger),
    reduxReactRouter({
      routes,
      createHistory
    })
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, {...initialStates, ...props});

  return store;
};
