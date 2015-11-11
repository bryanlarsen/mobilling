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
    rightButton: null,
    tabbar: null,
    tabbarProps: {},
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
    var tabbar = false;
    var tabbarProps = {};
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
        claimId: paths[2]
      };
      tabbar = require('../components/native/TabBar.jsx');
      tabbarProps = {claimId: paths[2]};
      switch(paths[3]) {
      case 'patient':
        webView.component = 'NativePatientPage';
        tabbarProps.active = 'patient';
        break;
      case 'claim':
        webView.component = 'NativeClaimPage';
        tabbarProps.active = 'claim';
        break;
      case 'consult':
        webView.component = 'NativeConsultPage';
        tabbarProps.active = 'consult';
        break;
      case 'items':
        webView.component = 'NativeItemsPage';
        tabbarProps.active = 'items';
        break;
      case 'comment':
        webView.component = 'NativeCommentPage';
        tabbarProps.active = 'comment';
        break;
      }
      break;
    default:
      console.log('unkown paths', paths);
    }
    return { route: {path, params}, webView, component, title, leftButton, rightButton, tabbar, tabbarProps };

  }
};
