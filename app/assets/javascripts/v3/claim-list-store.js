var claimListStore = Fynx.createSimpleStore(Immutable.fromJS([]));
var claimListActions = Fynx.createActions([
  'init',
  'add',
  'updateField',
]);

claimListActions.init.listen(function(data) {
  console.log('init', data);
  claimListStore(Immutable.fromJS(data));
})

claimListActions.add.listen(function(claim) {
  claimListStore(claimListStore().push(Immutable.fromJS(claim)));
});

claimListActions.updateField.listen(function(data) {
  var i = claimListStore().findIndex(function(claim) {
    return claim.get('id') === data.id;
  });

  claimListStore(claimListStore().setIn([i, data.field], data.value));
});
