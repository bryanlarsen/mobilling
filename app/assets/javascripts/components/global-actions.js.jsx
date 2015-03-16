var globalStore = Fynx.createSimpleStore(Immutable.fromJS({
  busy: 0,
  claimsListQuery: {filter: 'drafts', sort: '-number'}
}));

var globalActions = Fynx.createActions([
  'startBusy',
  'endBusy',
  'unrecoverableError',
  'signout'
]);

globalActions.startBusy.listen(function(data) {
  globalStore(globalStore().set('busy', globalStore().get('busy') + 1));
});

globalActions.endBusy.listen(function(data) {
  globalStore(globalStore().set('busy', globalStore().get('busy') - 1));
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
  location.reload();
});
