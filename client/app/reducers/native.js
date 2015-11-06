//const claimsReducer, { initialState as claimsState } = require('./claimsReducer');

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

module.exports = {
  reducers: {
 //  claimStore: claimsReducer,
    globalStore: globalReducer,
    userStore: userReducer,
    params: paramsReducer,
  },

  initialState: {
//  claimStore: claimsState,
    globalStore: globalState,
    userStore: userState,
    params: paramsState,
  }
};
