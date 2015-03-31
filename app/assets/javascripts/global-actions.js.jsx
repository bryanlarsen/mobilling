var globalStore = Fynx.createSimpleStore(Immutable.fromJS({
  busy: 0,
  unsaved: [],
  claimsListQuery: {filter: 'drafts', sort: '-number'},
  feeGenerator: null
}));

var globalActions = Fynx.createActions([
  'startBusy',
  'endBusy',
  'unrecoverableError',
  'signout',
  'startSave',
  'endSave'
]);

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
  //location.reload();
});

window.onbeforeunload = function(ev) {
  if (globalStore().get('busy') || globalStore().get('unsaved').size > 0) {
    ev.returnValue = "Changes not saved."
    return ev.returnValue;
  }
};
