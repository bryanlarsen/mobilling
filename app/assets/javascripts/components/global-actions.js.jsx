var globalStore = Fynx.createSimpleStore(Immutable.fromJS({
  busy: 0
}));
var globalActions = Fynx.createActions([
  'startBusy',
  'endBusy',
  'unrecoverableError'
]);

globalActions.startBusy.listen(function(data) {
  globalStore(globalStore().set('busy', globalStore().get('busy') + 1));
});

globalActions.endBusy.listen(function(data) {
  globalStore(globalStore().set('busy', globalStore().get('busy') - 1));
});

globalActions.unrecoverableError.listen(function(data) {
  // is probably session expired, so go back to login screen
  // if not, this may fix it
  // FIXME: flash message
//  location.reload();
});
