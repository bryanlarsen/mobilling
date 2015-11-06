const { routerStateReducer } = require('redux-router');

const claimsReducer, { initialState as claimsState } = require('./claimsReducer');
const globalReducer, { initialState as globalState } = require('./globalReducer');
const userReducer, { initialState as userState } = require('./userReducer');

module.exports = {
  claimStore: claimsReducer,
  globalStore: globalReducer,
  userStore: userReducer,
  router: routerStateReducer
};

export const initialStates = {
  claimStore: claimsState,
  globalStore: globalState,
  userStore: userState,
};
