const { compose, createStore, applyMiddleware, combineReducers } = require('redux');
const thunkMiddleware = require('redux-thunk');
const { reduxReactRouter } = require('redux-router');
const createHistory = require('history/lib/createBrowserHistory');
const createLogger = require('redux-logger');
const busyMiddleware = require('./middleware/busyMiddleware');

const routes = require('./routes');
const {reducers, initialState} = require('./reducers/index.js');

const beforeunload = function(ev) {
  ev.returnValue = "Changes not saved.";
  return ev.returnValue;
};

module.exports = (props) => {
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
  const store = storeCreator(reducer, {...initialState, ...props});

  if (window) {
    store.subscribe(() => {
      console.log('busy', store.getState().globalStore.busy);
      window.onbeforeunload = store.getState().globalStore.busy ? beforeunload : null;
    });
  }

  return store;
};
