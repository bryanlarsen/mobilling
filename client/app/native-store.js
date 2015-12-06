import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import busyMiddleware from './middleware/busyMiddleware';


import reducers, { initialStates } from './reducers/native';

export default () => {
  const reducer = combineReducers(reducers);
  const logger = createLogger();
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, busyMiddleware, logger),
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, initialStates);

  return store;
};
