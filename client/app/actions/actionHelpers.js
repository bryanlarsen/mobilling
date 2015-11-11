import _ from 'underscore';

export function writeHelper({dispatch, method, url, action_prefix, payload, updateAction, responseAction}) {
  dispatch({type: action_prefix + '.START', payload: payload});
  fetch(url, {
    method: method,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then((response) => response.json()).then((json) => {
    if (!_.isEmpty(json.errors)) {
      var update = {...payload, errors: json.errors};
      dispatch(updateAction(update));
      dispatch({type: action_prefix + '.FAILED', payload});
      return;
    }
    dispatch(responseAction(json));
    dispatch({type: action_prefix + '.FINISH', payload: json});
  }).catch((error) => {
    var update = {errors: {}, ...payload};
    _.each(payload, (value, key) => {
      update.errors[key] = ['server error'];
    });
    dispatch(updateAction(update));
    dispatch({type: action_prefix + '.FAILED', payload});
    console.error(error);
  });
};
