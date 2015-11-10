const { compose, createStore, applyMiddleware, combineReducers } = require('redux');
const thunkMiddleware = require('redux-thunk');
const createLogger = require('redux-logger');
const busyMiddleware = require('./middleware/busyMiddleware');

const routes = require('./routes');
const {reducers, initialState} = require('./reducers/admin');

const beforeunload = function(ev) {
  ev.returnValue = "Changes not saved.";
  return ev.returnValue;
};

module.exports = (props) => {
  const reducer = combineReducers(reducers);
  const logger = createLogger();
  const composedStore = compose(
    applyMiddleware(thunkMiddleware, busyMiddleware, logger),
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, {...initialState, ...props});

  if (window) {
    store.subscribe(() => {
      console.log('busy', store.getState().globalStore.busy);
      window.onbeforeunload = store.getState().globalStore.busy ? beforeunload : null;
    });
  }

  return store;
};
