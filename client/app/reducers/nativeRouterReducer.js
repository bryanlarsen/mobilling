"use strict";

// holds params for the pages that aren't using redux-router (aka the
// admin pages)

module.exports = {
  initialState: {
    route: {path: '/login', params: {}},
    webView: {component: 'BlankPage'},
    component: require('../components/native/LoginFrame.jsx'),
    title: 'Login',
    leftButton: null,
    rightButton: null
  },

  reducer: function nativeRouterReducer(state = module.exports.initialState, action) {
    const { type, payload } = action;

    if (type !== 'PUSH_STATE') return state;
    var {path, params} = payload;
    var component = false;
    var webView = {component: 'BlankPage'};
    var title = 'Login';
    var paths = path.split('/');
    var leftButton = null;
    var rightButton = null;
    switch(paths[1]) {
    case 'login':
      component = require('../components/native/LoginFrame.jsx');
      title='Login';
      break;
    case 'claims':
      component = require('../components/native/ClaimsFrame.jsx');
      title='Claims';
      break;
    case 'claim':
      title='Claim';
      leftButton = {text: 'claims', route: {path: '/claims'}};
      webView = {
        component: 'NativePatientPage',
        claimId: paths[2]
      };
      break;
    default:
      console.log('unkown paths', paths);
    }
    return { route: {path, params}, webView, component, title, leftButton, rightButton };

  }
};
