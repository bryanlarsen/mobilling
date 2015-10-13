(function(exports) {
var originalClaim = {};
exports.claimStore = Fynx.createSimpleStore(Immutable.fromJS({}));
var claimActions = exports.claimActions = Fynx.createActions([
  'init',
  'undo',
  'newClaim',
  'updateFields',
  'deleteFields',
  'newItem',
  'removeItem',
  'newPremium',
  'removePremium',
  'newDiagnosis',
  'removeDiagnosis',
  'attemptSave',
  'saveComplete',
  'saveFailed',
  'load',
  'remove',
  'patch',
]);

// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
exports.uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

claimStore.listen(function(store) {
//  console.log('change', store);
});

var updateItem = function(item) {
  var feeGenerator = globalStore().get('feeGenerator');
  if (!feeGenerator) return item;

  var result = feeGenerator.calculateFee(item.toJS(), item.get('code'));
  if (result) {
    item = item.set('fee', result.fee).set('units', result.units);

    item.get('premiums').forEach(function(premium, i) {
      var result = feeGenerator.calculateFee(item.toJS(), premium.get('code'));
      if (result) {
        item = item.setIn(['premiums', i, 'fee'], result.fee)
          .setIn(['premiums', i, 'units'], result.units);
      }
    });
  }
  return item;
};

// TODO: checkout forceSave
// TODO: updateItem
// TODO: check *all* attemptSave

/*
claimActions.updateFields.listen(function(data) {
  console.log('updateFields', data);
  var changed = false;
  var save = new Immutable.Map();
  var items = {};
  var newStore = claimStore().withMutations(function(store) {
    _.each(data, function(tuple) {
      if (tuple[1] === '*recalculate') {
        items[tuple[0][0]] = items[tuple[0][0]] || {};
        // assert tuple[0][1] === 'daily_details'
        items[tuple[0][0]][tuple[0][2]] = true;
      }

      if (store.getIn(tuple[0]) === tuple[1]) return;
      changed = true;
      var name = tuple[0][tuple[0].length-1];
      if (name !== 'validations' && tuple[0][1] !== 'validations') save = save.setIn(tuple[0], tuple[1]);
      console.log('updateField', tuple[0], tuple[1], ', was', claimStore().getIn(tuple[0]));
      store.setIn(tuple[0], tuple[1]);
    });
/*
    _.each(save, function(t, id) {
      store.set(id, updateConsult(store.get(id)));
    });
*/
    _.each(items, function(hash, id) {
      _.each(hash, function(t, i) {
        store.setIn([id, 'daily_details', i], updateItem(store.getIn([id, 'daily_details', i])));
        save = save.setIn([id, 'daily_details', i], updateItem(store.getIn([id, 'daily_details', i])));
      });
    });
  });

  if (data.forceSave) {
    claimStore(newStore);
    save.forEach(function(v, id) {
      claimActions.attemptSave(id);
    });
  } else if (changed) {
    claimStore(newStore);
    save.forEach(function(v, id) {
      claimActions.patch({id: id, claim: v.toJS()});
    });
  }
});
*/

// right now this is only used for validations, so there is no server
  // sync code
claimActions.deleteFields.listen(function(data) {
  console.log('deleteFields', data);
  _.each(data, function(path) {
    claimStore(claimStore().deleteIn(path));
  });
});

var serverCalculatedFields = ['errors', 'warnings', 'submission', 'total_fee', 'submitted_fee', 'paid_fee', 'original_id', 'reclamation_id', 'photo', 'errors', 'warnings', 'files', 'consult_premium_visit_count', 'consult_premium_first_count', 'consult_premium_travel_count', 'service_date', 'consult_setup_visible', 'consult_tab_visible'];

claimActions.attemptSave.listen(function(id) {
  throw new Error('attemptSave: no');

  console.log('attemptSave', id);

  if(claimStore().get([id, 'unsaved'])) {
    claimStore(claimStore().setIn([id, 'needs_save'], true));
    console.log('save busy, postponing');
    return;
  }

  // assume that we get here because we've changed something.   bigger assumption is that everything tha makes a change attempts to save it.
  claimStore(claimStore().setIn([id, 'changed'], true).setIn([id, 'unsaved'], true).setIn([id, 'needs_save'], false));

  var claim = _.omit(claimStore().get(id).toJS(), 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at', 'url', 'unsaved', 'changed', 'photo', 'comments', 'needs_save');
  globalActions.startBusy();
  globalActions.startSave(id);
  $.ajax({
//    url: claimStore().get('url'),
    url: window.ENV.API_ROOT+'v1/claims/'+id+'.json',
    data: JSON.stringify({claim: claim}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: 'PUT',
    success: function(data) {
      var updated = _.pick.apply(null, [data].concat(serverCalculatedFields));
      updated.id = id;
      claimActions.saveComplete(updated);
      globalActions.endBusy();
      globalActions.endSave(id);
    },
    error: function(xhr, status, err) {
      globalActions.endBusy();

      if (xhr.status === 403) {
        globalActions.signin();
      } else if (xhr.responseJSON) {
        var data = {id: id};
        data.warnings = xhr.responseJSON.warnings;
        data.errors = xhr.responseJSON.errors;
        claimActions.saveFailed(data);
      } else {
        globalActions.unrecoverableError();
      }
    }
  });
});

claimActions.patch.listen(function(data) {
  console.log('patch', data);
  var id = data.id;

  var claim = _.omit(claimStore().get(id).toJS(), 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at', 'url', 'unsaved', 'changed', 'photo', 'comments', 'needs_save');
  globalActions.startBusy();
  $.ajax({
//    url: claimStore().get('url'),
    url: window.ENV.API_ROOT+'v1/claims/'+id+'.json',
    data: JSON.stringify({claim: data.claim}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: 'PATCH',
    success: function(data) {
      var updated = _.pick.apply(null, [data].concat(serverCalculatedFields));
      updated.id = id;
      claimActions.saveComplete(updated);
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
        claimActions.saveFailed(data);
      } else {
        globalActions.unrecoverableError();
      }
    }
  });
});

var processClaimResponse = function(data) {
  claimStore().get(data.id).withMutations(function(store) {
    _.each(data, function(value, type) {
      if (serverCalculatedFields.indexOf(type) !== -1) {
        store = store.set(type, Immutable.fromJS(value));
      }
    });
    claimStore(claimStore().set(data.id, store));
  });
};

var processItemResponse = function(data) {
  claimStore().setIn([data.id, data.index, 'warnings'], Immutable.fromJS(data.response.warnings));
  claimStore().setIn([data.id, data.index, 'errors'], Immutable.fromJS(data.response.errors));
};

claimActions.init.listen(function(data) {
  console.log('init', data);
  _.each(data.diagnoses, function(diagnosis, i) {
    diagnosis.uuid = uuid();
  });

  claimStore(claimStore().set(data.id, Immutable.fromJS(data)));
  originalClaim[data.id] = data;
  processClaimResponse({id: data.id, warnings: data.warnings, errors: data.errors});
});

claimActions.undo.listen(function(id) {
  claimStore(Immutable.fromJS(originalClaim[id]));
  processClaimResponse({id: id, warnings: originalClaim.warnings, errors: originalClaim.errors});
  claimActions.attemptSave(id);
  claimStore(claimStore().setIn([id, 'changed'], false));
});

claimActions.newClaim.listen(function(opts) {
  console.log('newClaim');
  globalActions.startBusy();
  $.ajax({
    url: window.ENV.API_ROOT+'v1/claims.json',
    data: JSON.stringify({claim: {status: 'saved'}}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: 'POST',
    success: function(data) {
      claimActions.init(data)
      claimListActions.add(data.id);
      globalActions.endBusy();
      opts.callback && opts.callback(data.id);
    },
    error: function(xhr, status, err) {
      globalActions.endBusy();
      if (xhr.status === 403) globalActions.signin();
      else globalActions.unrecoverableError();
    }
  });
});

claimActions.saveComplete.listen(function(data) {
  console.log('saveComplete', data);
  claimStore(claimStore().setIn([data.id, 'unsaved'], false));
  processClaimResponse(data);
  if(claimStore().get([data.id, 'needs_save'])) {
    console.log('needs_save: saving');
    claimActions.attemptSave(data.id);
  };
});

claimActions.saveFailed.listen(function(data) {
  console.log('saveFailed', data);
  processClaimResponse(data);
});

claimActions.newItem.listen(function(data) {
  data.template.diagnosis = data.template.diagnosis || claimStore().getIn([data.id, 'diagnoses', 0, 'name']);
  data.index = data.index || claimStore().getIn([data.id, 'items']).count() - 1;
  console.log('newItem', data);
  var newItem = Immutable.fromJS(data.template);
  newItem = updateItem(newItem);

  var newList = claimStore().getIn([data.id, 'items']).splice(data.index + 1, 0, newItem);
  claimStore(claimStore().setIn([data.id, 'items'], newList.toList()));

  globalActions.startBusy();
  if (!data.dontSave) {
    $.ajax({
      url: window.ENV.API_ROOT+'v1/claims/'+data.id+'/items',
      data: JSON.stringify({item: newItem.toJS()}),
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      type: 'POST',
      success: function(response) {
        processItemResponse({id: data.id, index: data.index + 1, response: response});
        globalActions.endBusy();
      },
      error: function(xhr, status, err) {
        globalActions.endBusy();
        if (xhr.status === 403) globalActions.signin();
        else globalActions.unrecoverableError();
      }
    });
  }
});

claimActions.removeItem.listen(function(data) {
  console.log('removeItem', data);
  var newList = claimStore().getIn([data.id, 'daily_details']).splice(data.index, 1);
  claimStore(claimStore().setIn([data.id, 'daily_details'], newList.toList()));
  if (!data.dontSave) {
    claimActions.attemptSave(data.id);
  }
});

claimActions.newPremium.listen(function(data) {
  console.log('newPremium', data);

  var item = claimStore().getIn([data.id, 'daily_details', data.item]);
  var list = item.get('premiums') || Immutable.List();
  list = list.push(Immutable.Map({
    uuid: uuid()
  }));
  claimStore(claimStore().setIn([data.id, 'daily_details', data.item, 'premiums'], list));

  claimActions.attemptSave(data.id);
});

claimActions.removePremium.listen(function(data) {
  console.log('removePremium', data);
  var newList = claimStore().getIn([data.id, 'daily_details', data.item, 'premiums']);
  newList = newList.splice(data.premium, 1).toList();
  claimStore(claimStore().setIn([data.id, 'daily_details', data.item, 'premiums'], newList));
  claimActions.attemptSave(data.id);
});

claimActions.newDiagnosis.listen(function(id) {
  console.log('newDiagnosis', id);
  var diagnoses = claimStore().getIn([id, 'diagnoses']);
  diagnoses = diagnoses.push(Immutable.fromJS({
    name: "",
    uuid: uuid()
  }));
  claimStore(claimStore().setIn([id, 'diagnoses'], diagnoses));
  claimActions.attemptSave(id);
});

claimActions.removeDiagnosis.listen(function(data) {
  console.log('removeDiagnosis', data);
  var diagnoses = claimStore().getIn([data.id, 'diagnoses']).remove(data.index);
  claimStore(claimStore().setIn([data.id, 'diagnoses'], diagnoses));
  claimActions.attemptSave(data.id);
});


claimActions.load.listen(function(opts) {
  console.log('load',opts.id);
  globalActions.startBusy();
  $.ajax({
    url: window.ENV.API_ROOT+'v1/claims/'+opts.id+'.json',
    dataType: 'json',
    success: function(data) {
      claimActions.init(data);
      globalActions.endBusy();
      if(opts.success) {
        opts.success();
      }
    },
    error: function(xhr, status, err) {
      console.error(opts.id+': error loading. '+err.toString())
      globalActions.endBusy();
      if (xhr.status === 403) globalActions.signin();
      else globalActions.unrecoverableError();
    }
  });
});

claimActions.remove.listen(function(id) {
  console.log('load',id);
  globalActions.startBusy();
  $.ajax({
    url: window.ENV.API_ROOT+'v1/claims/'+id+'.json',
    dataType: 'json',
    type: 'DELETE',
    success: function(data) {
      globalActions.endBusy();
      claimStore(claimStore().remove(id));
      claimListActions.remove(id);
    },
    error: function(xhr, status, err) {
      console.error(id+': error deleting. '+err.toString())
      globalActions.endBusy();
      if (xhr.status === 403) globalActions.signin();
      else globalActions.unrecoverableError();
    }
  });
});

var actionsFor = {};

exports.claimActionsFor = function(id) {
  if (actionsFor[id]) return actionsFor[id];

  actionsFor[id] = Fynx.createActions([
    'init',
    'patch',
    'deleteFields',
    'newDiagnosis',
    'removeDiagnosis',
    'newItem',
    'removeItem',
    'newPremium',
    'removePremium',
  ]);

  actionsFor[id].init.listen(function(data) {
    claimActions.init(data);
  });

  actionsFor[id].patch.listen(function(data) {
    console.log('claim patch', data);
    var newData = _.map(data, function(tuple) {
      return [[id].concat(tuple[0]), tuple[1]];
    });
    if (data.forceSave) {
      newData.forceSave = id;
    }
    claimActions.updateFields(newData);
  });

  actionsFor[id].deleteFields.listen(function(data) {
    console.log('claim deleteFields', data);
    var newData = _.map(data, function(path) {
      return [id].concat(path);
    });
    claimActions.deleteFields(newData);
  });

  actionsFor[id].newDiagnosis.listen(function(data) {
    claimActions.newDiagnosis(id);
  });

  actionsFor[id].removeDiagnosis.listen(function(index) {
    claimActions.removeDiagnosis({id: id, index: index});
  });

  actionsFor[id].newItem.listen(function(data) {
    data = data || {};
    data.id = id;
    claimActions.newItem(data);
  });

  actionsFor[id].removeItem.listen(function(data) {
    data.id = id;
    claimActions.removeItem(data);
  });

  actionsFor[id].newPremium.listen(function(data) {
    data.id = id;
    claimActions.newPremium(data);
  });

  actionsFor[id].removePremium.listen(function(data) {
    data.id = id;
    claimActions.removePremium(data);
  });

  return actionsFor[id];
};

var itemActions = {};

exports.itemActionsFor = function(id, i) {
  itemActions[id] = itemActions[id] || [];
  if (itemActions[id][i]) return itemActions[id][i];

  var claimActions = claimActionsFor(id);

  itemActions[id][i] = Fynx.createActions([
    'updateFields',
    'newItem',
    'removeItem',
    'newPremium',
    'removePremium',
  ]);

  itemActions[id][i].updateFields.listen(function(data) {
    console.log('item updateFields', data);
    throw new Error('foo');
    var newData = [];
    var toDelete = []
    _.forEach(data, function(tuple) {
      newData.push([['daily_details', i].concat(tuple[0]), tuple[1]]);
      if (tuple[0][0]==='validations') {
        var path = ['validations', 'daily_details.'+i+'.code']
        if (tuple[1].get('code')) {
          newData.push([path, tuple[1].get('code')]);
        } else {
          toDelete.push(path);
        }
      }
      if (tuple[0][2]==='validations') {
        var path = ['validations', 'daily_details.'+i+'.premiums.'+tuple[0][1]+'.code'];
        if (tuple[1].get('code')) {
          newData.push([path, tuple[1].get('code')]);
        } else {
          toDelete.push(path);
        }
      }
    });
    claimActions.updateFields(newData);
    claimActions.deleteFields(toDelete);
  });

  itemActions[id][i].newItem.listen(function(data) {
    console.log('newItem', data);
    claimActions.newItem({index: i});
  });

  itemActions[id][i].removeItem.listen(function(data) {
    console.log('item removeItem', data);
    claimActions.removeItem({index: i});
  });

  itemActions[id][i].newPremium.listen(function(data) {
    console.log('item newPremium', data);
    claimActions.newPremium({item: i});
  });

  itemActions[id][i].removePremium.listen(function(data) {
    console.log('item removePremium', data);
    claimActions.removePremium({item: i, premium: data.premium});
  });

  return itemActions[id][i];
}

exports.claimLoad = function(id) {
  return claimActions.load(id);
}

})(window);
