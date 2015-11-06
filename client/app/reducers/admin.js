const claimsReducer, { initialState as claimsState } = require('./claimsReducer');
const globalReducer, { initialState as globalState } = require('./globalReducer');
const userReducer, { initialState as userState } = require('./userReducer');
const paramsReducer, { initialState as paramsState } = require('./paramsReducer');

module.exports = {
  claimStore: claimsReducer,
  globalStore: globalReducer,
  userStore: userReducer,
  params: paramsReducer,
};

export const initialStates = {
  claimStore: claimsState,
  globalStore: globalState,
  userStore: userState,
  params: paramsState,
};
