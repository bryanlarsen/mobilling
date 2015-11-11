import _ from 'underscore';
import { startBusy, endBusy } from "./globalActions";
import { writeHelper } from "./actionHelpers";
import { pushState } from "redux-router";

export function  newSession(payload) {
    return { type: 'USER.INIT', payload };
  }

export function  logIn(callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(newSession(response));
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
                   updateAction: newSession,
                   responseAction: done
                  });
    };
  }

export function  newUser(callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(newSession(response));
      callback(response);
    };
    return (dispatch, getState) => {
      const user = getState().userStore;
      writeHelper({dispatch,
                   method: 'POST',
                   url: `${window.ENV.API_ROOT}v1/users.json`,
                   action_prefix: 'USER.CREATE',
                   payload: user,
                   updateAction: newSession,
                   responseAction: done
                  });
    };
  }

export function  updateUser(updates) {
    return (dispatch, getState) => {
      dispatch(updateUserAttributes(updates));
      const user = getState().userStore;
      if (user.id) {
        writeHelper({dispatch,
                       method: 'PATCH',
                       url: `${window.ENV.API_ROOT}v1/users/${user.id}.json`,
                       action_prefix: 'USER.PATCH',
                       payload: updates,
                       updateAction: updateUserAttributes,
                       responseAction: userResponse
                      });
      }
    };
  }

export function  changePassword(updates, callback) {
    const done = (response) => (dispatch, getState) => {
      dispatch(userResponse(response));
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
                     updateAction: updateUserAttributes,
                     responseAction: done
                    });
      }
    };
  }

export function  userResponse(response) {
    return { type: 'USER.UPDATE',
             payload: _.pick(response, 'errors', 'warnings', 'doctors', 'notice') };
  }

export function  updateUserAttributes(payload) {
    return { type: 'USER.UPDATE', payload };
  }

export function  setNotice(payload) {
    return { type: 'SET_NOTICE', payload };
  }

export function  userChangeHandler(dispatch, ev) {
    if (!ev.target) return;
    var target = ev.target;
    while(target.value === undefined) target = target.parentElement;
    let updates = {};
    updates[target.name] = target.value;
    dispatch(updateUser(updates));
  }
