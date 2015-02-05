var claimListStore = Fynx.createSimpleStore(Immutable.fromJS([]));
var claimListActions = Fynx.createActions([
  'init',
  'add',
  'updateField',
  'remove'
]);

claimListActions.init.listen(function(data) {
  console.log('init', data);
  claimListStore(Immutable.fromJS(data));
})

claimListActions.add.listen(function(claim) {
  claimListStore(claimListStore().push(Immutable.fromJS(claim)));
});

claimListActions.remove.listen(function(id) {
  var i = claimListStore().findIndex(function(claim) {
    return claim.get('id') === id;
  });

  claimListStore(claimListStore().remove(i));
});

claimListActions.updateField.listen(function(data) {
  var i = claimListStore().findIndex(function(claim) {
    return claim.get('id') === data.id;
  });

  claimListStore(claimListStore().setIn([i, data.field], data.value));
});
