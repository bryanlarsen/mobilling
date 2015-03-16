var claimListStore = Fynx.createSimpleStore(Immutable.fromJS([]));
var claimListActions = Fynx.createActions([
  'init',
  'add',
  'remove'
]);

claimListActions.init.listen(function(data) {
  console.log('init', data);
  claimListStore(Immutable.fromJS(_.map(data, function(claim) {
    claimAbbreviatedActions.add(claim);
    return claim.id;
  })));
})

claimListActions.add.listen(function(id) {
  claimListStore(claimListStore().push(id));
});

claimListActions.remove.listen(function(id) {
  var i = claimListStore().indexOf(id);
  claimListStore(claimListStore().remove(i));
});
