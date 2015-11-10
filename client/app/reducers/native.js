const claims = require('./claimsReducer');
const claimsReducer = claims.reducer;
const claimsState = claims.initialState;

const globalR = require('./globalReducer');
const globalReducer = globalR.reducer;
const globalState = globalR.initialState;

const user = require('./userReducer');
const userReducer = user.reducer;
const userState = user.initialState;

const params = require('./paramsReducer');
const paramsReducer = params.reducer;
const paramsState = params.initialState;

const nativeRouter = require('./nativeRouterReducer');
const nativeRouterReducer = nativeRouter.reducer;
const nativeRouterState = nativeRouter.initialState;

module.exports = {
  reducers: {
    claimStore: claimsReducer,
    globalStore: globalReducer,
    userStore: userReducer,
    params: paramsReducer,
    nativeRouter: nativeRouterReducer
  },

  initialState: {
    claimStore: claimsState,
    globalStore: globalState,
    userStore: userState,
    params: paramsState,
    nativeRouter: nativeRouterState
  }
};
