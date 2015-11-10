const _ = require('underscore');

module.exports = {};
module.exports.writeHelper = function({dispatch, method, url, action_prefix, payload, updateAction, responseAction}) {
  dispatch({type: action_prefix + '.START', payload: payload});
  fetch(url, {
    method: method,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then((response) => {
    console.log('response', response);
    return response.json();
  }).then((json) => {
    
    dispatch(responseAction(json));
    dispatch({type: action_prefix + '.FINISH', payload: json});
  }).catch((error) => {
    payload.errors = payload.errors || {};
    _.each(payload, (value, key) => {
      payload.errors[key] = ['server error'];
    });
    dispatch(updateAction(payload));
    dispatch({type: action_prefix + '.FAILED', payload});
  });
};
