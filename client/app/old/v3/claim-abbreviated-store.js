var claimAbbreviatedStore = Fynx.createSimpleStore(Immutable.fromJS({}));
var claimAbbreviatedActions = Fynx.createActions([
  'add',
  'remove'
]);

claimAbbreviatedActions.add.listen(function(claim) {
  claimAbbreviatedStore(claimAbbreviatedStore().set(claim.id, Immutable.fromJS(claim)));
});

claimAbbreviatedActions.remove.listen(function(id) {
  claimAbbreviatedStore(claimAbbreviatedStore().remove(id));
});
