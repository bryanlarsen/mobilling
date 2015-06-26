var globalStore = Fynx.createSimpleStore(Immutable.fromJS({
  busy: 0,
  unsaved: [],
  claimsListQuery: {filter: 'drafts', sort: '-number'},
  feeGenerator: null,
  router: null,
  notice: null,
}));

var globalActions = Fynx.createActions([
  'startBusy',
  'endBusy',
  'unrecoverableError',
  'signout',
  'startSave',
  'endSave',
  'init',
  'setRouter',
  'setNotice',
  'clearNotice'
]);

globalActions.init.listen(function() {
  globalActions.startBusy();
  $.ajax({
    url: window.ENV.API_ROOT+'v1/claims',
    dataType: 'json',
    success: function(data) {
      claimListActions.init(data);
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      globalStore().get('router').transitionTo('/login');
      globalActions.endBusy();
    }
  });
  $.ajax({
    url: window.ENV.API_ROOT+'session.json',
    dataType: 'json',
    success: function(data) {
      userActions.init(data);
    },
    error: function(xhr, status, err) {
      globalStore().get('router').transitionTo('/login');
      globalActions.endBusy();
    }
  });
});

globalActions.setRouter.listen(function(router) {
  globalStore(globalStore().set('router', router));
});

globalActions.startBusy.listen(function(data) {
  globalStore(globalStore().set('busy', globalStore().get('busy') + 1));
});

globalActions.endBusy.listen(function(data) {
  globalStore(globalStore().set('busy', globalStore().get('busy') - 1));
});

globalActions.startSave.listen(function(id) {
  if (globalStore().get('unsaved').indexOf(id) < 0) {
    console.log('startSave', id);
    globalStore(globalStore().set('unsaved', globalStore().get('unsaved').push(id)));
  }
});

globalActions.endSave.listen(function(id) {
  var idx = globalStore().get('unsaved').indexOf(id);
  if (idx >= 0) {
    console.log('endSave', id);
    globalStore(globalStore().set('unsaved', globalStore().get('unsaved').splice(idx, 1)));
  }
});

globalActions.signout.listen(function(data) {
  $.ajax({
    url: '/session',
    type: 'DELETE',
    success: function() {
      console.log('signed out');
    },
    error: function() {
      console.log('error signing out');
      //globalActions.unrecoverableError();
    }
  });
});

globalActions.unrecoverableError.listen(function(data) {
  // is probably session expired, so go back to login screen
  // if not, this may fix it
  // FIXME: flash message
  console.log('unrecoverableError', data);
  Rollbar.error("unrecoverableError", data);
  location.reload();
});

globalActions.setNotice.listen(function(data) {
  console.log('setNotice', data);
  globalStore(globalStore().set('notice', data));
});

globalActions.clearNotice.listen(function(data) {
  console.log('clearNotice', data);
  if (data === globalStore().get('notice')) {
    globalStore(globalStore().set('notice', null));
  }
});

window.onbeforeunload = function(ev) {
  if (globalStore().get('busy') || globalStore().get('unsaved').size > 0) {
    ev.returnValue = "Changes not saved."
    return ev.returnValue;
  }
};
