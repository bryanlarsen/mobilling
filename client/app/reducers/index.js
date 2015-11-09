const { routerStateReducer } = require('redux-router');

const claims = require('./claimsReducer');
const claimsReducer = claims.reducer;
const claimsState = claims.initialState;

const globalR = require('./globalReducer');
const globalReducer = globalR.reducer;
const globalState = globalR.initialState;

const user = require('./userReducer');
const userReducer = user.reducer;
const userState = user.initialState;

module.exports = {
  reducers: {
    claimStore: claimsReducer,
    globalStore: globalReducer,
    userStore: userReducer,
    router: routerStateReducer,
  },

  initialState: {
    claimStore: claimsState,
    globalStore: globalState,
    userStore: userState,
  }
};
