import _ from 'underscore';
import { startBusy, endBusy } from "./globalActions";
import { updateObject } from "./actionHelpers";

function updateUserAttributes(updates) {
  return { type: 'UPDATE_USER', updates };
};

const userActions = {
  newSession(session) {
    return { type: 'NEW_SESSION', session };
  },

  updateUser(updates) {
    return (dispatch, getState) => {
      dispatch(updateUserAttributes(updates));
      const user = getState().userStore;
      if (user.id) {
        updateObject(dispatch,
                     `${window.ENV.API_ROOT}v1/users/${user.id}.json`,
                     updates,
                     updateUserAttributes,
                     userActions.userResponse)
      }
    };
  },

  userResponse(response) {
    return { type: 'UPDATE_USER',
             updates: _.pick(response, 'errors', 'warnings', 'doctors') };
  },

  userChangeHandler(dispatch, ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    dispatch(userActions.updateUser(updates));
  }

};

export default userActions;
