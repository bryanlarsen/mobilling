const { compose, createStore, applyMiddleware, combineReducers } = require('redux');
const createLogger = require('redux-logger');
const thunkMiddleware = require('redux-thunk');
const apiMiddleware = require('./middleware/apiMiddleware');

const {reducers, initialState} = require('./reducers/native');

module.exports = (props) => {
  console.log('unused props', props);
  const reducer = combineReducers(reducers);
  const logger = createLogger();
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, apiMiddleware, logger),
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, initialState);

  return store;
};
