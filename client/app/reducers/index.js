import { routerStateReducer } from 'redux-router';

import claimsReducer, { initialState as claimsState } from './claimsReducer';
import noticeReducer, { initialState as noticeState } from './noticeReducer';

export default {
  claimsStore: claimsReducer,
  noticeStore: noticeReducer,
  router: routerStateReducer
};

export const initialStates = {
  claimsStore: claimsState,
  noticeStore: noticeState,
};
