import { routerStateReducer } from 'redux-router';

import claimsReducer, { initialState as claimsState } from './claimsReducer';
import globalReducer, { initialState as globalState } from './globalReducer';
import userReducer, { initialState as userState } from './userReducer';

export default {
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
