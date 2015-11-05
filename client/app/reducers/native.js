//import claimsReducer, { initialState as claimsState } from './claimsReducer';
import globalReducer, { initialState as globalState } from './globalReducer';
import userReducer, { initialState as userState } from './userReducer';
import paramsReducer, { initialState as paramsState } from './paramsReducer';

export default {
//  claimStore: claimsReducer,
  globalStore: globalReducer,
  userStore: userReducer,
  params: paramsReducer,
};

export const initialStates = {
//  claimStore: claimsState,
  globalStore: globalState,
  userStore: userState,
  params: paramsState,
};
