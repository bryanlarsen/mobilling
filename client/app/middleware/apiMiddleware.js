const _ = require('underscore');

module.exports = (store) => (next) => (action) => {
  var {type, method, url, action_prefix, payload, successType, successAfter, successWhitelist, errorType, errorAfter, errorWhitelist, preType} = action;
  if (type === 'API_WRITE') {
    store.dispatch({type: 'START_BUSY'});
    if (preType) store.dispatch({type: preType, payload});
    console.log('fetch', url, payload);
    fetch(url, {
      method,
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
      console.log('json', json);
      if (json.errors) {
        if (errorType) {
          store.dispatch({type: errorType, payload: errorWhitelist ? _.pick(json, errorWhitelist) : json});
          errorType = null;
        }
        if (errorAfter) {
          store.dispatch(errorAfter);
          errorAfter = null;
        }
      } else {
        if (successType) store.dispatch({type: successType, payload: successWhitelist ? _.pick(json, successWhitelist) : json});
        if (successAfter) store.dispatch(successAfter);
      }
      store.dispatch({type: 'END_BUSY'});
    }).catch((error) => {
      console.log('error', error);
      payload.errors = payload.errors || {};
      _.each(payload, (value, key) => {
        payload.errors[key] = ['server error'];
      });
      if (errorType) store.dispatch({type: errorType, payload: errorWhitelist ? _.pick(payload, errorWhitelist) : payload});
      if (errorAfter) store.dispatch(errorAfter);
      store.dispatch({type: 'END_BUSY'});
    });
  }
  return next(action);
};
