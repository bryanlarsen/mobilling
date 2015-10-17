import _ from 'underscore';

export function updateObject(dispatch, url, action_prefix, updates, updateAction, responseAction) {
  dispatch({type: action_prefix + '.START', payload: updates});
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
    dispatch({type: action_prefix + '.FINISH', payload: json});
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
