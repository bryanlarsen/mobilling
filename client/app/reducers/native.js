import claimsReducer, { initialState as claimsState } from './claimsReducer';
import globalReducer, { initialState as globalState } from './globalReducer';
import userReducer, { initialState as userState } from './userReducer';

export default {
  claimStore: claimsReducer,
  globalStore: globalReducer,
  userStore: userReducer,
};

export const initialStates = {
  claimStore: claimsState,
  globalStore: globalState,
  userStore: userState,
};
