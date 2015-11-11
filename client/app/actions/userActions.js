import _ from 'underscore';
import { startBusy, endBusy } from "./globalActions";
import { writeHelper } from "./actionHelpers";
import { pushState } from "redux-router";

const userActions = {
  newSession(payload) {
    return { type: 'USER.INIT', payload };
  },

  logIn(callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(userActions.newSession(response));
      callback(response);
    };
    return (dispatch, getState) => {
      const user = getState().userStore;
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}session.json`,
                   action_prefix: 'SESSION.CREATE',
                   payload: {
                     email: user.email,
                     password: user.password
                   },
                   updateAction: userActions.newSession,
                   responseAction: done
                  });
    };
  },

  newUser(callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(userActions.newSession(response));
      callback(response);
    };
    return (dispatch, getState) => {
      const user = getState().userStore;
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}v1/users.json`,
                   action_prefix: 'USER.CREATE',
                   payload: user,
                   updateAction: userActions.newSession,
                   responseAction: done
                  });
    };
  },

  updateUser(updates) {
    return (dispatch, getState) => {
      dispatch(userActions.updateUserAttributes(updates));
      const user = getState().userStore;
      if (user.id) {
        writeHelper({dispatch,
                       method: 'PATCH',
                       url: `${window.ENV.API_ROOT}v1/users/${user.id}.json`,
                       action_prefix: 'USER.PATCH',
                       payload: updates,
                       updateAction: userActions.updateUserAttributes,
                       responseAction: userActions.userResponse
                      });
      }
    };
  },

  changePassword(updates, callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(userActions.userResponse(response));
      callback();
    };
    return (dispatch, getState) => {
      const user = getState().userStore;
      if (user.id) {
        writeHelper({dispatch,
                     method: 'PATCH',
                     url: `${window.ENV.API_ROOT}v1/users/${user.id}.json`,
                     action_prefix: 'USER.PATCH',
                     payload: updates,
                     updateAction: userActions.updateUserAttributes,
                     responseAction: done
                    });
      }
    };
  },

  userResponse(response) {
    return { type: 'USER.UPDATE',
             payload: _.pick(response, 'errors', 'warnings', 'doctors', 'notice') };
  },

  updateUserAttributes(payload) {
    return { type: 'USER.UPDATE', payload };
  },

  setNotice(payload) {
    return { type: 'SET_NOTICE', payload };
  },

  userChangeHandler(ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    return userActions.updateUser(updates);
  }

};

export default userActions;
