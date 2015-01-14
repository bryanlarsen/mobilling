var claimListStore = Fynx.createSimpleStore(Immutable.fromJS({}));
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


//FIXME
setTimeout(function() {
  globalActions.startBusy();
  $.ajax({
    url: '/v1/claims',
    dataType: 'json',
    success: function(data) {
      claimListActions.init(data);
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      console.error('error loading claims');
      globalActions.endBusy();
    }
  });
}, 500);

