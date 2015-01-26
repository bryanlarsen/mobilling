var claimListStore = Fynx.createSimpleStore(Immutable.fromJS([]));
var claimListActions = Fynx.createActions([
  'init',
  'add',
]);

claimListActions.init.listen(function(data) {
  console.log('init', data);
  claimListStore(Immutable.fromJS(data));
})

claimListActions.add.listen(function(claim) {
  claimListStore(claimListStore().push(Immutable.fromJS(claim)));
});

