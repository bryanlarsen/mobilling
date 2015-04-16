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

var updateConsult = function(claim) {
  var date = claim.get('admission_on') || claim.get('first_seen_on') || claim.get('last_seen_on');
  if (date && !claim.get('admission_on')) claim = claim.set('admission_on', date);
  if (date && !claim.get('first_seen_on')) claim = claim.set('first_seen_on', date);
  if (date && !claim.get('last_seen_on')) claim = claim.set('last_seen_on', date);

  if (claim.get('admission_on') === claim.get('first_seen_on') && !claim.get('first_seen_consult')) claim = claim.set('first_seen_consult', true);

  var premium = claim.get('consult_premium_visit');
  var travel = claim.get('consult_premium_travel');
  var day_type = claim.get('first_seen_on') && dayType(claim.get('first_seen_on'));
  var time_type = day_type && claim.get('consult_time_in') && timeType(claim.get('first_seen_on'), claim.get('consult_time_in'));

  if (!time_type) return claim;

  if (premium === 'weekday_office_hours' && time_type === 'weekday_day') time_type = premium;

  if (claim.get('consult_time_type') !== time_type) claim = claim.set('consult_time_type', time_type);

  if (premium && claim.get('consult_premium_first_count') === 0) claim = claim.set('consult_premium_first', true);

  if (claim.get('consult_premium_first_count') > 1 && claim.get('consult_premium_first')) claim = claim.set('consult_premium_first', false);

  if (!premium && claim.get('consult_premium_first')) claim = claim.set('consult_premium_first', false);

  if (premium && premium !== time_type) {
    premium = time_type;
    claim = claim.set('consult_premium_visit', premium);
  }

  if (!premium && travel) {
    travel = false;
    claim = claim.set('consult_premium_travel', travel);
  }

  return claim;
};

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

claimActions.updateFields.listen(function(data) {
  console.log('updateFields', data);
  var changed = false;
  var save = {};
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
      if (name !== 'validations' && tuple[0][1] !== 'validations') save[tuple[0][0]] = true;
      console.log('updateField', tuple[0], tuple[1], ', was', claimStore().getIn(tuple[0]));
      store.setIn(tuple[0], tuple[1]);
    });

    _.each(save, function(t, id) {
      store.set(id, updateConsult(store.get(id)));
    });

    _.each(items, function(hash, id) {
      _.each(hash, function(t, i) {
        store.setIn([id, 'daily_details', i], updateItem(store.getIn([id, 'daily_details', i])));
      });
    });
  });

  if (data.forceSave) {
    changed = true;
    save[data.forceSave] = true;
  }

  if (changed) {
    claimStore(newStore);
    _.each(save, function(t, id) {
      claimActions.attemptSave(id);
    });
  }
});

// right now this is only used for validations, so there is no server
  // sync code
claimActions.deleteFields.listen(function(data) {
  console.log('deleteFields', data);
  _.each(data, function(path) {
    claimStore(claimStore().deleteIn(path));
  });
});

var serverCalculatedFields = ['submission', 'submitted_fee', 'paid_fee', 'original_id', 'reclamation_id', 'photo', 'errors', 'warnings', 'files', 'consult_premium_visit_count', 'consult_premium_first_count', 'consult_premium_travel_count', 'service_date', 'consult_setup_visible', 'consult_tab_visible'];

claimActions.attemptSave.listen(function(id) {
  console.log('attemptSave', id);

  // assume that we get here because we've changed something.   bigger assumption is that everything tha makes a change attempts to save it.
  claimStore(claimStore().setIn([id, 'changed'], true).setIn([id, 'unsaved'], true));

  var claim = _.omit(claimStore().get(id).toJS(), 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at', 'url', 'unsaved', 'changed', 'photo', 'comments');
  globalActions.startBusy();
  globalActions.startSave(id);
  $.ajax({
//    url: claimStore().get('url'),
    url: '/v1/claims/'+id,
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

      if (xhr.responseJSON) {
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
      if (type !== 'warnings' && type !== 'errors') return;
      for (var i=0; i < store.get('daily_details').count(); i++) {
        var premiums = store.getIn(['daily_details', i, 'premiums']);
        if (premiums) {
          for (var j=0; j < premiums.count(); j++) {
            var before = store.getIn(['daily_details', i, 'premiums', j, type]);
            if (before && before.count() > 0) {
              store = store.setIn(['daily_details', i, 'premiums', j, type], Immutable.Map());
            }
          }
        }
        var before = store.getIn(['daily_details', i, type]);
        if (before && before.count() > 0) {
          store = store.setIn(['daily_details', i, type], Immutable.Map());
        }
      };
      _.each(value, function(messages, key) {
        var path = key.split('.');
        path.splice(-1, 0, type);
        store = store.setIn(path, Immutable.fromJS(messages));
      });
    });
    claimStore(claimStore().set(data.id, store));
  });
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
    url: '/v1/claims',
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
      globalActions.unrecoverableError();
    }
  });
});

claimActions.saveComplete.listen(function(data) {
  console.log('saveComplete', data);
  claimStore(claimStore().setIn([data.id, 'unsaved'], false));
  processClaimResponse(data);
});

claimActions.saveFailed.listen(function(data) {
  console.log('saveFailed', data);
  processClaimResponse(data);
});

claimActions.newItem.listen(function(data) {
  data.template.uuid = data.template.uuid || uuid();
  data.template.premiums = data.template.premiums || [];
  data.template.diagnosis = data.template.diagnosis || claimStore().getIn([data.id, 'diagnoses', 0, 'name']);
  data.index = data.index || claimStore().getIn([data.id, 'daily_details']).count() - 1;
  console.log('newItem', data);
  var newItem = Immutable.fromJS(data.template);
  newItem = updateItem(newItem);

  var newList = claimStore().getIn([data.id, 'daily_details']).splice(data.index + 1, 0, newItem);
  claimStore(claimStore().setIn([data.id, 'daily_details'], newList.toList()));

  if (!data.dontSave) {
    claimActions.attemptSave(data.id);
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
    url: '/v1/claims/'+opts.id,
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
      globalActions.unrecoverableError();
    }
  });
});

claimActions.remove.listen(function(id) {
  console.log('load',id);
  globalActions.startBusy();
  $.ajax({
    url: '/v1/claims/'+id,
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
      globalActions.unrecoverableError();
    }
  });
});

var actionsFor = {};

exports.claimActionsFor = function(id) {
  if (actionsFor[id]) return actionsFor[id];

  actionsFor[id] = Fynx.createActions([
    'init',
    'updateFields',
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

  actionsFor[id].updateFields.listen(function(data) {
    console.log('claim updateFields', data);
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
