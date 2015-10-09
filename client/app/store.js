import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import createLogger from 'redux-logger';

import routes from './routes';
import reducers, { initialStates } from './reducers';

export default (props) => {
  console.log('initial store props FIXME', props);

  const reducer = combineReducers(reducers);
  const logger = createLogger({
    transformer: state => ({ ...state, claimsStore: state.claimsStore.toJS() })
  });
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, logger),
    reduxReactRouter({
      routes,
      createHistory
    })
  );
  const storeCreator = composedStore(createStore);
  console.log('initialStates', initialStates);
  const store = storeCreator(reducer, initialStates);

  return store;
};
