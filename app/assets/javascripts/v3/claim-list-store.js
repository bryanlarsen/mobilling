var claimListStore = Fynx.createStore(Immutable.fromJS({}));
var claimListActions = Fynx.createActions([
  'init',
]);

claimListActions.init.listen(function(data) {
  console.log('init', data);
  claimListStore(Immutable.fromJS(data));
})

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

