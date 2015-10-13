import { routerStateReducer } from 'redux-router';

import claimsReducer, { initialState as claimsState } from './claimsReducer';
import noticeReducer, { initialState as noticeState } from './noticeReducer';
import globalReducer, { initialState as globalState } from './globalReducer';
import userReducer, { initialState as userState } from './userReducer';

export default {
  claimStore: claimsReducer,
  noticeStore: noticeReducer,
  globalStore: globalReducer,
  userStore: userReducer,
  router: routerStateReducer
};

export const initialStates = {
  claimStore: claimsState,
  globalStore: globalState,
  noticeStore: noticeState,
  userStore: userState,
};
