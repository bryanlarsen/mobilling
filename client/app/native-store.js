const { compose, createStore, applyMiddleware, combineReducers } = require('redux');
const thunkMiddleware = require('redux-thunk');
const createLogger = require('redux-logger');
const busyMiddleware = require('./middleware/busyMiddleware');

const {reducers, initialState} = require('./reducers/native');

module.exports = (props) => {
  console.log('unused props', props);
  const reducer = combineReducers(reducers);
  const logger = createLogger();
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, busyMiddleware, logger),
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, initialState);

  return store;
};
