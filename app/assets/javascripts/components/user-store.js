
var userStore = Fynx.createSimpleStore(Immutable.fromJS({
  role: "doctor",
  specialty_code: 0,
}));

var userCheckpoint = null;

var userActions = Fynx.createActions([
  'init',
  'updateFields',
  'attemptSave',
  'forgotPassword',
  'saveComplete',
  'saveFailed',
  'checkpoint',
  'restore',
 ]);

userActions.updateFields.listen(function(data) {
  var changed = false;
  userStore(userStore().withMutations(function(store) {
    _.each(data, function(tuple) {
      if (store.getIn(tuple[0]) === tuple[1]) return;
      changed = true;
      store.setIn(tuple[0], tuple[1]);
    });
    if (changed) store.set('unsaved', true);
  }));
  if (changed && !data.dontSave) userActions.attemptSave();
});

userActions.init.listen(function(data) {
  if (data) userStore(Immutable.fromJS(data));
});

userActions.attemptSave.listen(function() {
  console.log('user attemptSave');
  var id = userStore().get('id');
  var url = window.ENV.API_ROOT+'v1/users' + (id ? '/'+id : '') + '.json';
  var method = id ? 'PUT' : 'POST';

  var user = _.omit(userStore().toJS(), 'warnings', 'errors', 'id', 'created_at', 'updated_at', 'unsaved', 'changed');
  globalActions.startBusy();
  $.ajax({
    url: url,
    data: JSON.stringify({user: user}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: method,
    success: function(data) {
      if (data.notice) globalActions.setNotice(data.notice);
      userActions.saveComplete({id: id, errors: data.errors, warnings: data.warnings});
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      globalActions.endBusy();

      if (xhr.status === 403) {
        globalActions.signin();
      } else if (xhr.responseJSON) {
        var data = {id: id};
        data.warnings = xhr.responseJSON.warnings;
        data.errors = xhr.responseJSON.errors;
        userActions.saveFailed(data);
      } else {
        globalActions.unrecoverableError();
      }
    }
  });
});

userActions.forgotPassword.listen(function() {
  console.log('user forgotPassword');
  var url = window.ENV.API_ROOT+'v1/request_password_reset.json';

  globalActions.startBusy();
  $.ajax({
    url: url,
    data: JSON.stringify({create_password_reset: {email: userStore().get('email')}}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: 'POST',
    success: function(data) {
      if (data.notice) globalActions.setNotice(data.notice);
      userActions.saveComplete({errors: data.errors, warnings: data.warnings});
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      globalActions.endBusy();

      if (xhr.status === 403) {
        globalActions.signin();
      } else if (xhr.responseJSON) {
        var data = {};
        data.warnings = xhr.responseJSON.warnings;
        data.errors = xhr.responseJSON.errors;
        userActions.saveFailed(data);
      } else {
        globalActions.unrecoverableError();
      }
    }
  });
});

var processUserResponse = function(data) {
  userStore(userStore()
            .set('warnings', Immutable.fromJS(data.warnings || []))
            .set('errors', Immutable.fromJS(data.errors || [])));
};

userActions.saveComplete.listen(function(data) {
  console.log('saveComplete', data);
  userStore(userStore().set('unsaved', false));
  processUserResponse(data);
});

userActions.saveFailed.listen(function(data) {
  console.log('saveFailed', data);
  processUserResponse(data);
});

userActions.checkpoint.listen(function() {
  console.log('checkpoint');
  userCheckpoint = userStore();
});

userActions.restore.listen(function() {
  console.log('restore');
  userStore(userCheckpoint);
});
