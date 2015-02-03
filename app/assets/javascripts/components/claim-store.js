(function(exports) {
var originalClaim = {};
exports.claimStore = Fynx.createSimpleStore(Immutable.fromJS({}));
var claimActions = exports.claimActions = Fynx.createActions([
  'init',
  'undo',
  'newClaim',
  'updateFields',
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

claimActions.updateFields.listen(function(data) {
  console.log('updateFields', data);
  var changed = false;
  var save = {};
  var newStore = claimStore().withMutations(function(store) {
    _.each(data, function(tuple) {
      if (store.getIn(tuple[0]) === tuple[1]) return;
      changed = true;
      var name = tuple[0][tuple[0].length-1];
      if (name !== 'validations' && tuple[0][1] !== 'validations') save[tuple[0][0]] = true;
      console.log('updateField', tuple[0], tuple[1], ', was', claimStore().getIn(tuple[0]));
      store.setIn(tuple[0], tuple[1]);
    });
  });

  if (changed) {
    claimStore(newStore);
    _.each(save, function(t, id) {
      claimActions.attemptSave(id);
    });
  }
});

claimActions.attemptSave.listen(function(id) {
  console.log('attemptSave', id);

  // assume that we get here because we've changed something.   bigger assumption is that everything tha makes a change attempts to save it.
  claimStore(claimStore().setIn([id, 'changed'], true).setIn([id, 'unsaved'], true));

  var claim = _.omit(claimStore().get(id).toJS(), 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at', 'url', 'unsaved', 'changed', 'photo', 'comments');
  globalActions.startBusy();
  $.ajax({
//    url: claimStore().get('url'),
    url: '/v1/claims/'+id,
    data: JSON.stringify({claim: claim}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: 'PUT',
    success: function(data) {
      claimActions.saveComplete({id: id, errors: data.errors, warnings: data.warnings, submission: data.submission});
      globalActions.endBusy();
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
      if (type === 'submission') {
        store = store.set(type, value);
        return;
      }
      if (type !== 'warnings' && type !== 'errors') return;
      store = store.set(type, Immutable.fromJS(value));
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
  if (!data.template) {
    if (['family_medicine', 'internal_medicine', 'cardiology'].indexOf(data.specialty) !== -1) {
      data.template = 'full';
    } else {
      data.template = 'simplified';
    }
  }

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
      claimListActions.add(data);
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
  console.log('newItem', data);
  data.template.uuid = data.template.uuid || uuid();
  data.template.premiums = data.template.premiums || [];
  data.index = data.index || claimStore().getIn([data.id, 'daily_details']).count() - 1;
  console.log('newItem', data);
  var newItem = Immutable.fromJS(data.template);

  var newList = claimStore().getIn([data.id, 'daily_details']).splice(data.index + 1, 0, newItem);
  claimStore(claimStore().setIn([data.id, 'daily_details'], newList.toList()));

  itemActionsFor(data.id, data.index + 1).recalculate();
  // claimActions.attemptSave(data.id); done by the recalculate
});

claimActions.removeItem.listen(function(data) {
  console.log('removeItem', data);
  var newList = claimStore().getIn([data.id, 'daily_details']).splice(data.index, 1);
  claimStore(claimStore().setIn([data.id, 'daily_details'], newList.toList()));
  claimActions.attemptSave(data.id);
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


claimActions.load.listen(function(id) {
  console.log('load',id);
  globalActions.startBusy();
  $.ajax({
    url: '/v1/claims/'+id,
    dataType: 'json',
    success: function(data) {
      claimActions.init(data);
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      console.error(id+': error loading. '+err.toString())
      globalActions.endBusy();
      globalActions.unrecoverableError();
    }
  });
})

var actionsFor = {};

exports.claimActionsFor = function(id) {
  if (actionsFor[id]) return actionsFor[id];

  actionsFor[id] = Fynx.createActions([
    'init',
    'updateFields',
    'newDiagnosis',
    'removeDiagnosis',
    'newItem',
    'removeItem',
    'newPremium',
    'removePremium',
    'recalculateConsult',
  ]);

  actionsFor[id].init.listen(function(data) {
    claimActions.init(data);
  });

  actionsFor[id].updateFields.listen(function(data) {
    console.log('claim updateFields', data);
    var newData = [];
    _.forEach(data, function(tuple) {
      newData.push([[id].concat(tuple[0]), tuple[1]]);
    });
    claimActions.updateFields(newData);
    console.log('details', detailsGenerator(claimStore().get(id).toJS()));
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

  actionsFor[id].recalculateConsult.listen(function() {
    var changes = [];
    var premium = claimStore().getIn([id, 'consult_premium_visit']);
    var travel = claimStore().getIn([id, 'consult_premium_travel']);
    var day_type = claimStore().getIn([id, 'first_seen_on']) && dayType(claimStore().getIn([id, 'first_seen_on']));
    var time_type = day_type && claimStore().getIn([id, 'consult_time_in']) && timeType(claimStore().getIn([id, 'first_seen_on']), claimStore().getIn([id, 'consult_time_in']));

    if (!time_type) return;

    if (premium && !(premium === time_type || (premium === 'weekday_office_hours' && time_type === 'weekday_day'))) {
      premium = time_type;
      changes.push([['consult_premium_visit'], premium]);
    }

    if (!premium && travel) {
      travel = null;
      changes.push([['consult_premium_travel'], travel]);
    }

    if (changes.length) {
      actionsFor[id].updateFields(changes);
    }
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
    'recalculate'
  ]);

  itemActions[id][i].updateFields.listen(function(data) {
    console.log('item updateFields', data);
    var newData = [];
    _.forEach(data, function(tuple) {
      newData.push([['daily_details', i].concat(tuple[0]), tuple[1]]);
      if (tuple[0][0]==='validations') {
        newData.push([['validations', 'daily_details.'+i+'.code'], tuple[1].get('code')]);
      }
      if (tuple[0][2]==='validations') {
        newData.push([['validations', 'daily_details.'+i+'.premiums.'+tuple[0][1]+'.code'], tuple[1].get('code')]);
      }
    });
    claimActions.updateFields(newData);
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

  itemActions[id][i].recalculate.listen(function(data) {
    console.log('item recalculate', data);
    var store = claimStore().getIn([id, 'daily_details', i]);
    var item = store.toJS();
    feeGenerator().then(function(feeGenerator) {
      var result = feeGenerator.calculateFee(item, item.code);
      if (result) {
        var updates = [
          [['fee'], result.fee],
          [['units'], result.units],
        ];
        item.fee = result.fee;
        item.units = result.units;

        store.get('premiums').forEach(function(premium, i) {
          var result = feeGenerator.calculateFee(item, premium.get('code'));
          if (result) {
            updates = updates.concat([
              [['premiums', i, 'fee'], result.fee],
              [['premiums', i, 'units'], result.units]
            ]);
          }
        });
        itemActions[id][i].updateFields(updates);
      }
    });
  });

  return itemActions[id][i];
}

exports.claimLoad = function(id) {
  return claimActions.load(id);
}

})(window);
