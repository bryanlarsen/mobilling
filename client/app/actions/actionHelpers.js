import _ from 'underscore';
import { startBusy, endBusy } from "./globalActions";

export function updateObject(dispatch, url, updates, updateAction, responseAction) {
  dispatch(startBusy());
  fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  }).then((response) => response.json()).then((json) => {
    dispatch(responseAction(json));
    dispatch(endBusy());
  }).catch((error) => {
    updates.errors = updates.errors || {};
    _.each(updates, (value, key) => {
      updates.errors[key] = ['server error'];
    });
    dispatch(updateAction(updates));
    dispatch(endBusy());
    console.error(error);
  });
};
