var provinces = {
  ON: 'Ontario',
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NL: 'Newfoundland and Labrador',
  NB: 'New Brunswick',
  NT: 'Northwest Territories',
  NS: 'Nova Scotia',
  PE: 'Prince Edward Island',
  SK: 'Saskatchewan',
  NU: 'Nunavut',
  YT: 'Yukon'
};

var claimStore = Fynx.createStore(Immutable.fromJS({}));
var claimActions = Fynx.createActions([
  'init',
  'updateFields',
  'newItem',
  'removeItem',
  'newPremium',
  'removePremium',
  'newDiagnosis',
  'removeDiagnosis',
  'attemptSave',
  'saveComplete',
  'saveFailed'
]);

// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
var uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

claimStore.listen(function(store) {
  console.log('change', store);
});

claimActions.updateFields.listen(function(data) {
  var changed = false;
  var save = false;
  var newStore = claimStore().deref().withMutations(function(store) {
    _.each(data, function(tuple) {
      if (store.getIn(tuple[0]) === tuple[1]) return;
      changed = true;
      var name = tuple[0][tuple[0].length-1];
      if (name==='validations' || tuple[0][0]) save = true;
      console.log('updateField', tuple[0], tuple[1], ', was', claimStore().deref().getIn(tuple[0]));
      store.setIn(tuple[0], tuple[1]);
    });
  });

  if (changed) claimStore(newStore);
  if (save) claimActions.attemptSave();
});

claimActions.attemptSave.listen(function(data) {
  console.log('attemptSave');
  var claim = _.omit(claimStore().deref().toJS(), 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at', 'url');
  $.ajax({
    url: claimStore().get('url'),
    data: JSON.stringify({claim: claim}),
    contentType: 'application/json',
    dataType: 'json',
    processData: false,
    type: 'PUT',
    success: function(data) {
      claimActions.saveComplete({errors: data.errors, warnings: data.warnings});
    },
    error: function(xhr, status, err) {
      var data = {};
      if (xhr.responseJSON) {
        data.warnings = xhr.responseJSON.warnings;
        data.errors = xhr.responseJSON.errors;
      }
      claimActions.saveFailed(data);
    }
  });
});

var processClaimResponse = function(data) {
  claimStore(claimStore().deref().withMutations(function(store) {
    _.each(data, function(value, type) {
      // type is 'errors' or 'warnings'
      store.set(type, Immutable.fromJS(value));
      for (var i=0; i < store.get('daily_details').count(); i++) {
        var premiums = store.getIn(['daily_details', i, 'premiums']);
        if (premiums) {
          for (var j=0; j < premiums.count(); j++) {
            var before = store.getIn(['daily_details', i, 'premiums', j, type]);
            if (before && before.count() > 0) {
              store.setIn(['daily_details', i, 'premiums', j, type], Immutable.Map());
            }
          }
        }
        var before = store.getIn(['daily_details', i, type]);
        if (before && before.count() > 0) {
          store.setIn(['daily_details', i, type], Immutable.Map());
        }
      };
      _.each(value, function(messages, key) {
        var path = key.split('.');
        path.splice(-1, 0, type);
        claimStore(store.setIn(path, Immutable.fromJS(messages)));
      });
    });
  }));
};

claimActions.init.listen(function(data) {
  console.log('init', data);
  _.each(data.diagnoses, function(diagnosis, i) {
    diagnosis.uuid = uuid();
  });
  claimStore(Immutable.fromJS(data));
  processClaimResponse({warnings: data.warnings, errors: data.errors});
});

claimActions.saveComplete.listen(function(data) {
  console.log('saveComplete', data);
  processClaimResponse(data);
});

claimActions.saveFailed.listen(function(data) {
  console.log('saveFailed', data);
  processClaimResponse(data);
});

claimActions.newItem.listen(function(data) {
  console.log('newItem', data);
  var newItem = claimStore().deref().getIn(['daily_details', data.index || 0]);
  if (!newItem) {
    newItem = Immutable.fromJS({
      day: new Date().toISOString().slice(0,10),
      premiums: [],
      uuid: uuid()
    });
  } else {
    newItem = newItem.set('uuid', uuid());
  }

  var newList = claimStore().get('daily_details').splice(data.index+1 || 0, 0, newItem);
  claimStore().set('daily_details', newList.toList());

  claimActions.attemptSave();
});

claimActions.removeItem.listen(function(data) {
  console.log('removeItem', data);
  var newList = claimStore().get('daily_details').splice(data.index, 1);
  claimStore().set('daily_details', newList.toList());
  claimActions.attemptSave();
});

claimActions.newPremium.listen(function(data) {
  console.log('newPremium', data);

  var item = claimStore().deref().getIn(['daily_details', data.item]);
  var list = item.get('premiums') || Immutable.List();
  list = list.push(Immutable.Map({
    code: item.get('code'),
    fee: item.get('fee'),
    units: item.get('units'),
    uuid: uuid()
  }));
  claimStore(claimStore().deref().setIn(['daily_details', data.item, 'premiums'], list));

  claimActions.attemptSave();
});

claimActions.removePremium.listen(function(data) {
  console.log('removePremium', data);
  var newList = claimStore().deref().getIn(['daily_details', data.item, 'premiums']);
  newList = newList.splice(data.premium, 1).toList();
  claimStore(claimStore().deref().setIn(['daily_details', data.item, 'premiums'], newList));
  claimActions.attemptSave();
});

claimActions.newDiagnosis.listen(function(data) {
  var diagnoses = claimStore().get('diagnoses');
  diagnoses.set(diagnoses.count(), Immutable.fromJS({
    name: "",
    uuid: uuid()
  }));
  claimActions.attemptSave();
});

claimActions.removeDiagnosis.listen(function(data) {
  claimStore().get('diagnoses').remove(data);
  claimActions.attemptSave();
});

var feeGenerator = new Promise(function(resolve, reject) {
  setTimeout(function() {  // make sure all requests necessary to render page (like fonts) go ahead of us in the queue
    $.ajax({
      url: '/v1/service_codes.json',
      dataType: 'json',
      success: function(data) {
        // FIXME: once we switch over, this should be done at the server
        var array = new Array(_.size(data));
        var hash = {};
        _.each(data, function(sc, i) {
          hash[sc.code] = sc;
          array[i] = sc.name;
        });
        serviceCodesEngine.add(array);
        resolve(new FeeGenerator(hash));
      },
      error: function(xhr, status, err) {
        console.error('failed to load service codes');
        reject(Error('failed to load service codes'));
      }
    });
  }, 100);
});


var ClaimEdit = React.createClass({
  mixins: [
    Fynx.connect(claimStore, 'claim'),
  ],

  getInitialState: function(event) {
    this.store = claimStore;
    this.actions = claimActions;
    return {
      unsaved: false,
      changed: false,
      validations: {}
    };
  },

  undo: function() {
    this.setState({claim: this.initialClaim, unsaved: false, changed: false}, this.sync);
  },

  load: function(id) {
    $.ajax({
      url: '/v1/claims/'+id,
      dataType: 'json',
      success: function(data) {
        this.setState({claim: data, unsaved: false});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(id+': error loadling. '+err.toString())
      }.bind(this)
    });
  },

/*  handleChange: function(event) {
    var current = this.state.claim;
    var baseName;
    _.each(event.target.name.split('.'), function(name) {
      current = current[name];
      baseName = name;
    });
    var value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    if (baseName === 'fee') value = Math.round(Number(value)*100);
    if (baseName === 'units') value = parseInt(value);
    if (current === value) return;

    this.actions.updateFields({field: event.target.name, value: event.target.value});

    var newState = {$set: value};
    _.each(event.target.name.split('.').reverse(), function(name) {
      var temp = {};
      temp[name] = newState;
      newState = temp;
    });
    newState = React.addons.update(this.state, {claim: newState, changed: {$set: true}});
    this.setState(newState, this.sync);
  },

  newItem: function(item) {
    console.log('WTF old newItem');
    if (item) {
      var clone = _.clone(item);
      clone.premiums = _.clone(item.premiums || []);
    } else {
      var clone = {
        day: new Date().toISOString().slice(0,10)
      };
    }
    this.setState(React.addons.update(this.state, {
      claim: {
        daily_details: {'$push': [clone]}
      }
    }), this.sync);
  }, */

  newPremium: function(index) {
    var item = this.state.claim.daily_details[index];
    var clone = _.pick(item, 'code', 'fee', 'units');
    var newState = {
      claim: {
        daily_details: {
        }
      }
    };
    newState.claim.daily_details[index] = {
      premiums: item.premiums ? {'$push': [clone]} : {'$set': [clone]}
    };
    this.setState(React.addons.update(this.state, newState), this.sync);
  },

  removeItem: function(index) {
    var newState = { claim: _.clone(this.state.claim) };
    newState.claim.daily_details = _.clone(newState.claim.daily_details);
    newState.claim.daily_details.splice(index, 1);
    this.replaceState(newState, this.sync);
  },

  removePremium: function(claimIndex, premiumIndex) {
    var newState = { claim: _.clone(this.state.claim) };
    newState.claim.daily_details = _.clone(this.state.claim.daily_details);
    newState.claim.daily_details[claimIndex].premiums = _.clone(newState.claim.daily_details[claimIndex].premiums);
    newState.claim.daily_details[claimIndex].premiums.splice(premiumIndex, 1);
    this.replaceState(newState, this.sync);
  },

  newDiagnosis: function() {
    this.setState(React.addons.update(this.state, {claim: {diagnoses: {$push: [{name: ""}]}}}), this.sync);
  },

  removeDiagnoses: function(index) {
    var newState = { claim: _.clone(this.state.claim) };
    newState.claim.diagnoses = _.clone(newState.claim.diagnoses);
    newState.claim.diagnoses.splice(index, 1);
    this.replaceState(newState, this.sync);
  },

  recalculate: function(itemIndex, premiumIndex, event) {
    var form = this;

    var detail = form.state.claim.daily_details[itemIndex];
    var newState = { claim: { daily_details: {} }, changed: {$set: true}, validations: {} };
    newState.claim.daily_details[itemIndex] = { premiums: {} };
    var fullName = "daily_details."+itemIndex;
    if (typeof premiumIndex === "number") {
      var line = detail.premiums[premiumIndex];
      var out = newState.claim.daily_details[itemIndex].premiums[premiumIndex] = {};
      fullName = fullName + ".premiums."+premiumIndex;
    } else {
      var line = detail;
      var out = newState.claim.daily_details[itemIndex];
      event = premiumIndex;
    }

    var names = event.target.name.split('.');
    var name = names[names.length-1];
    if (line[name] === event.target.value) return;

    out[name] = {$set: event.target.value};
    line[name] = event.target.value;

    form.feeGenerator.then(function(feeGenerator) {

      var result = feeGenerator.calculateFee(detail, line.code);
      if (result) {
        out.fee = {$set: result.fee};
        out.units = {$set: result.units};
        newState.validations = {$set: _.omit(form.state.validations, fullName+".code")};

        if (typeof premiumIndex !== "number") {
          detail.fee = result.fee;
          detail.units = result.units;

          for(premiumIndex = 0; premiumIndex < (detail.premiums || []).length; premiumIndex++) {
            line = detail.premiums[premiumIndex];
            out = newState.claim.daily_details[itemIndex].premiums[premiumIndex] = {};
            result = feeGenerator.calculateFee(detail, line.code);
            if (result) {
              out.fee = {$set: result.fee};
              out.units = {$set: result.units};
            }
          }
        }

        form.setState(React.addons.update(form.state, newState), form.sync);
      } else {
        newState.validations[fullName+".code"] = {$set: ['not found']};
        form.setState(React.addons.update(form.state, newState), form.sync);
      }
    });

  },

  sync: function(claim, callback) {
/*    claim = _.omit(claim || this.state.claim, 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at');
    $.ajax({
      url: this.props.url,
      data: JSON.stringify({claim: claim}),
      contentType: 'application/json',
      dataType: 'json',
      processData: false,
      type: 'PUT',
      success: function(data) {
        this.setState({unsaved: false, warnings: data.warnings, errors: data.errors});
        if (callback) return callback(null, data);
      }.bind(this),
      error: function(xhr, status, err) {
        if (xhr.responseJSON && xhr.responseJSON.warnings && xhr.responseJSON.errors) {
          this.setState({unsaved: true, warnings: xhr.responseJSON.warnings, errors: xhr.responseJSON.errors});
        } else {
          this.setState({unsaved: true});
        }
        if (callback) return callback(err, xhr.responseJSON);
      }.bind(this),
    }); */
  },

  render: function() {
    var cur = this.props.stack.indexOf(this.state.claim.id);
    var next = this.props.stack[cur+1];
    var prev = this.props.stack[cur-1];
    var form = this;
    return (
      <div className="form-horizontal">
        <ClaimForm
          validations={this.state.validations}
          actions={claimActions}
          newItem={this.newItem}
          newPremium={this.newPremium}
          removeItem={this.removeItem}
          removePremium={this.removePremium}
          recalculate={this.recalculate}
          form={this} />

        <fieldset>
          <legend>Action</legend>

          <div className="form-group">
            <div className="col-md-10 col-md-offset-2">
              <button className="btn btn-warning" onClick={this.undo} disabled={!this.state.changed}>
                <i className="fa fa-undo"/>
                &nbsp;Undo
              </button>
            </div>
          </div>

          {
           _.map({
            "saved":          ["saved", "for_agent", "ready"],
            "for_agent":      ["for_agent", "ready", "doctor_attention", "done"],
            "ready":          ["for_agent", "ready", "doctor_attention", "done", "reclaimed"],
            "file_created":   ["file_created", "uploaded", "acknowledged", "agent_attention", "done"],
            "uploaded":       ["uploaded", "acknowledged", "agent_attention", "done"],
            "acknowledged":   ["acknowledged", "agent_attention", "done"],
            "agent_attention": ["agent_attention", "done", "reclaimed"],
            "doctor_attention": ["doctor_attention", "for_agent", "ready"],
            "done":           ["done", "reclaimed"],
            "reclaimed":      ["done", "reclaimed"],
           }[this.state.claim.status], function(status) {

             var disabled = this.state.unsaved || !_.isEmpty(this.state.claim.errors);
             if (status === 'ready' &&
                 (!_.isEmpty(this.state.validations) ||
                  !_.isEmpty(this.state.claim.warnings))) {
                    disabled = true;
             }

             if (status === 'reclaimed') {
               return (
                 <div className="row" key="action-reclaimed">
                   <button className="btn btn-primary col-md-2 col-md-offset-4" onClick={this.load.bind(this, prev)} disabled={!prev || disabled}>
                     <i className="fa fa-recycle"/>
                     &nbsp;Reclaim
                   </button>
                 </div>
               );
             }

             var className = (status === this.state.claim.status ? 'btn btn-info col-md-2' : 'btn btn-primary col-md-2');

             var prevHandler = function() {
               form.state.claim.status = status;
               form.sync(form.state.claim, function(err, claim) {
                 if (!err) form.load(prev);
               });
             };

             var nextHandler = function() {
               form.state.claim.status = status;
               form.sync(form.state.claim, function(err, claim) {
                 if (!err) form.load(next);
               });
             };

             var doneHandler = function() {
               form.state.claim.status = status;
               form.sync(form.state.claim, function(err, claim) {
                 if (!err) window.location.href = form.props.backURL;
               });
             };

             return (
              <div className="row" key={'action-'+status}>
                  <div className="col-md-2"/>
                  <button className={className} onClick={prevHandler} disabled={!prev || disabled}>
                    <i className="fa fa-angle-left"/>
                    &nbsp;{_.string.humanize(status)}
                  </button>

                  <button className={className} onClick={doneHandler} disabled={disabled}>
                    <i className="fa fa-check"/>
                    &nbsp;{_.string.humanize(status)}
                  </button>

                  <button className={className} onClick={nextHandler} disabled={!next || disabled}>
                    <i className="fa fa-angle-right"/>
                    &nbsp;{_.string.humanize(status)}
                  </button>
              </div>
             );
           }, this)
          }
        </fieldset>
      </div>
    );
  }
});

var Pickadate = React.createClass({
  onClick: function() {
    event.stopPropagation();
    var element = $(this.getDOMNode());
    var picker = element.pickadate({
      format: "yyyy-mm-dd",
      //container: ".app-body",
      //min: attributes.min === undefined ? false : attributes.min,
      //max: attributes.max === undefined ? false : attributes.max,
      max: new Date(),
      //editable: this.props.birthday,
      selectYears: this.props.birthday ? 150 : false,
      selectMonths: this.props.birthday
    }).pickadate("picker");

    picker.start();
    picker.open();

    picker.on('close', function() {
      element.blur();
      picker.stop();
      element.attr({readOnly: true});
      this.props.onChange({
        target: element[0],
      });
    }.bind(this));
  },

  render: function() {
    return (
      <input
        type="text"
        readOnly
        {...this.props}
        onClick={this.onClick}  />
    );
  }
});

var Pickatime = React.createClass({
  onClick: function(event) {
    event.stopPropagation();
    var element = $(this.getDOMNode());
    var component = this;
    var picker = element.pickatime({
      interval: 15,
      format: "HH:i",
      formatLabel: function (time) {
        var tin, tout;

        if (component.props.min) {
          tin = FeeGenerator.inMinutes(component.props.min);
          tout = time.pick;
        }

        if (component.props.max) {
          tin = time.pick;
          tout = FeeGenerator.inMinutes(component.props.max);
        }

        if (tin !== undefined) {
          var hours = (tout-tin) / 60;
          if (hours < 0) hours = hours+24;
          return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
        } else {
          return "HH:i";
        }
      },
    }).pickatime("picker");

    picker.start();
    picker.open();

    picker.on('close', function() {
      element.blur();
      picker.stop();
      element.attr({readOnly: true});
      this.props.onChange({
        target: element[0],
      });
    }.bind(this));

  },

  render: function() {
    return (
      <input
        type="text"
        readOnly
        {...this.props}
        onClick={this.onClick}  />
    );
  }
});

var ClaimInputWrapper = React.createClass({
  render: function() {
    var messages = Immutable.fromJS([]);

    if (this.props.store) {
      ['warnings', 'errors', 'validations'].forEach(function(type) {
        var m = this.props.store.getIn([type, this.props.name]);
        if (m) messages = messages.concat(m);
      }, this);
    }

    return (
      <div>
        {this.props.children}
        {
         _.map(_.flatten(messages.toJS()), function(msg, i) {
           return <div key={"err-name-"+i} className="help-block">{msg}</div>;
         })
        }
      </div>
    );
  }
});

var ClaimInput = React.createClass({
  render: function() {
    return (
      <ClaimInputWrapper {...this.props}>
        <ClaimInputInner {...this.props}/>
      </ClaimInputWrapper>
    );
  }
});

var ClaimInputInner = React.createClass({
  render: function() {
    return (
      <BlurInput type={this.props.type} className={"form-control "+this.props.className || ''} name={this.props.name} value={this.props.value || (this.props.store && this.props.store.get(this.props.name))} onChange={this.props.onChange} />
    );
  }
});

var hospitalsEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  prefetch: {
    url: "/v1/hospitals.json",
  }
});
setTimeout(function() {
  hospitalsEngine.initialize();
}, 500);

var diagnosesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  prefetch: {
    url: "/v1/diagnoses.json",
  }
});
setTimeout(function() {
  diagnosesEngine.initialize();
}, 500);

var serviceLocationsEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: ['', 'HDS', 'HED', 'HIP', 'HOP', 'HRP', 'OTN']
});
serviceLocationsEngine.initialize();

var serviceCodesEngine = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.nonword,
  queryTokenizer: Bloodhound.tokenizers.nonword,
  limit: 10,
  local: []
});
serviceCodesEngine.initialize();


var Typeahead = React.createClass({
  componentDidMount: function() {
    var component = this;
    var $el = $(this.getDOMNode());
    $el.typeahead({
      minLength: 1,
      highlight: true
    }, {
      displayKey: function(val) {return val;},
      source: component.props.engine.ttAdapter()
    }).on('typeahead:autocompleted', function(event, suggestion, dataset) {
      component.props.onChange(event);
    }).on('typeahead:selected', function(event, suggestion, dataset) {
      component.props.onChange(event);
    });
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).typeahead('destroy');
  },

  render: function() {
    return (
      <input type="search" className="form-control typeahead" name={this.props.name} defaultValue={this.props.value} onBlur={this.props.onChange}/>
    );
  }
});

var Select = React.createClass({
  render: function() {
    var value = this.props.value || this.props.store.get(this.props.name);
    return (
      <select className="form-control" value={value} name={this.props.name} onChange={this.props.onChange}>
        { _.map(this.props.options, function(label, code) {
            return (
              <option value={code} key={'option'+name+code} >{label}</option>
            );
          }, this)
         }
      </select>
    );
  }
});

var RadioSelect = React.createClass({
  render: function() {
    var value = this.props.value || this.props.store.get(this.props.name);

    return (
      <div className="btn-group">
        {
         _.map(this.props.options, function(label, code) {
           return (
             <label key={'rg'+this.props.name+code} className={"btn btn-default btn-lg "+(value===code ? 'btn-primary' : '')}>
               <input type="radio" id={this.props.name+code} value={code} name={this.props.name} className="hide" onChange={this.props.onChange} />
             {label}
             </label>
           );
         }, this)
        }
      </div>
    );
  }
});

var ClaimPremium = React.createClass({
  unitsChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], parseInt(ev.target.value)]]);
  },

  feeChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], Math.round(Number(ev.target.value)*100)]]);
  },

  codeChanged: function(ev) {
    var that = this;
    var value = ev.target.value;
    feeGenerator.then(function(gen) {
      messages = gen.validateCode(value);
      that.props.actions.updateFields([
        [['validations'], Immutable.fromJS({'code': messages})],
        [['code'], value]
      ]);
      if (!messages) {
        that.props.actions.recalculate();
      }
    });
  },

  render: function() {
    return (
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-4">
          <ClaimInputWrapper name='code' store={this.props.store}>
            <Typeahead name='code' engine={serviceCodesEngine} onChange={this.codeChanged} value={this.props.store.get('code')}/>
          </ClaimInputWrapper>
        </div>
        <div className="col-md-3">
          <ClaimInput name='units' type="text" store={this.props.store} onChange={this.unitsChanged}/>
        </div>
        <div className="col-md-3">
          <ClaimInput name='fee' type="text" value={(this.props.store.get('fee')/100).toFixed(2)} store={this.props.store} onChange={this.feeChanged}/>
        </div>
        <div className="col-md-1">
          <button type="button" className="btn btn-block btn-danger" onClick={this.props.actions.removePremium}>
            <i className="fa fa-close"/>
          </button>
        </div>
      </div>
    );
  }
});

var ClaimItem = React.createClass({
  fieldChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
    this.recalculate();
  },

  unitsChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], parseInt(ev.target.value)]]);
  },

  feeChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], Math.round(Number(ev.target.value)*100)]]);
  },

  codeChanged: function(ev) {
    var that = this;
    var value = ev.target.value;
    feeGenerator.then(function(gen) {
      messages = gen.validateCode(value);
      that.props.actions.updateFields([
        [['validations'], Immutable.fromJS({'code': messages})],
        [['code'], value]
      ]);
      if (!messages) {
        that.recalculate();
      }
    });
  },

  actions: function(i) {
    var that = this;
    this.premiumActions = this.premiumActions || [];
    if (this.premiumActions[i]) return this.premiumActions[i];

    var itemActions = this.props.actions;

    this.premiumActions[i] = Fynx.createActions([
      'updateFields',
      'removePremium',
      'recalculate',
    ]);

    this.premiumActions[i].updateFields.listen(function(data) {
      console.log('premium updateFields', data);
      var newData;
      newData = _.map(data, function(tuple) {
        return [['premiums', i].concat(tuple[0]), tuple[1]];
      });
      itemActions.updateFields(newData);
    });

    this.premiumActions[i].removePremium.listen(function(data) {
      console.log('premium removePremium', data);
      itemActions.removePremium({premium: i});
    });

    this.premiumActions[i].recalculate.listen(function(data) {
      console.log('premium recalculate', data);
      that.recalculate();
    });

    return this.premiumActions[i];
  },

  recalculate: function() {
    var store = this.props.store;
    var item = this.props.store.toJS();
    var actions = this.props.actions;
    feeGenerator.then(function(feeGenerator) {
      var result = feeGenerator.calculateFee(item, item.code);
      if (result) {
        var updates = [
          [['fee'], result.fee],
          [['units'], result.units],
        ];

        store.get('premiums').forEach(function(premium, i) {
          var result = feeGenerator.calculateFee(item, premium.get('code'));
          if (result) {
            updates = updates.concat([
              [['premiums', i, 'fee'], result.fee],
              [['premiums', i, 'units'], result.units]
            ]);
          }
        });
        actions.updateFields(updates);
      }
    });
  },

  newPremium: function(ev) {
    console.log('click newPremium');
    this.props.actions.newPremium();
  },

  render: function() {
    var premiums = this.props.store.get('premiums') ? this.props.store.get('premiums').deref().map(function(premium, i) {
      return React.createElement(ClaimPremium, _.extend({
        store: this.props.store.get('premiums').get(i),
        actions: this.actions(i),
        key: premium.get('uuid'),
      }, premium));
    }, this).toJS() : null;

    return (
      <div className="form-group">
        <div className="row">
          <div className="col-md-1">
            <button type="button" className="btn btn-block btn-success" onClick={this.props.actions.newItem}>
              <i className="fa fa-plus"/>
            </button>
          </div>
          <div className="col-md-3">
            <ClaimInput name='day' onChange={this.fieldChanged} type="text" store={this.props.store} />
          </div>
          <div className="col-md-1">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickadate className="hide" name='day' value={this.props.store.get('day')} readOnly onChange={this.fieldChanged} />
            </label>
          </div>
          <div className="col-md-2">
            <ClaimInput name='time_in' onChange={this.fieldChanged} type="text" store={this.props.store} />
          </div>
          <div className="col-md-1">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickatime className="hide" name='time_in' value={this.props.store.get('time_in')} readOnly onChange={this.fieldChanged} max={this.props.store.get('time_out')} />
            </label>
          </div>
          <div className="col-md-2">
            <ClaimInput name='time_out' onChange={this.fieldChanged} type="text" store={this.props.store} />
          </div>
          <div className="col-md-1">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickatime className="hide" name='time_out' value={this.props.store.get('time_out')} readOnly onChange={this.fieldChanged} min={this.props.store.get('time_in')} />
            </label>
          </div>
          <div className="col-md-1">
            { claimStore().get('daily_details').count() > 1 &&
             <button type="button" className="btn btn-block btn-danger" onClick={this.props.actions.removeItem}>
              <i className="fa fa-close"/>
             </button>
             }
          </div>
        </div>
        <div className="row">
          <div className="col-md-1">
            <button type="button" className="btn btn-block btn-success" onClick={this.newPremium}>
              <i className="fa fa-plus"/>
            </button>
          </div>
          <div className="col-md-4">
            <ClaimInputWrapper name='code' store={this.props.store}>
              <Typeahead name='code' engine={serviceCodesEngine} onChange={this.codeChanged} value={this.props.store.get('code')}/>
            </ClaimInputWrapper>
          </div>
          <div className="col-md-3">
            <ClaimInput name='units' type="text" store={this.props.store} onChange={this.unitsChanged} />
          </div>
          <div className="col-md-3">
            <ClaimInput name='fee' type="text" value={(this.props.store.get('fee')/100).toFixed(2)} store={this.props.store} onChange={this.feeChanged} />
          </div>
        </div>
        { premiums }
      </div>
    );
  }
});

var ClaimErrors = React.createClass({
  render: function() {
    if (!this.props.data || this.props.data.count()===0) return null;
    var numErrors = 0;
    var response = (
      <fieldset>
        <legend>{this.props.name}</legend>

        {
         _.map(this.props.data.toJS(), function(errs, name) {
           var nErrors = 0;
           var r = (
        <div className="form-group" key={'err-'+this.props.name+'-'+name}>
          <label className="control-label col-md-2">{_.string.humanize(name.replace(/\./g, ': '))}</label>
          <div className="col-md-10">
          { _.map(errs, function(err, i) {
            nErrors++;
            numErrors++;
            return (
              <p key={'err-'+this.props.name+'-'+name+'-'+i}
                 className="form-control-static">
                {err}
              </p>
            );
            }, this)
          }
          </div>
        </div>
           );
           return nErrors ? r : null;
         }, this)
         }
      </fieldset>
    );
    return numErrors ? response : null;
  }
});

var ClaimInputGroup = React.createClass({
  render: function() {
    return (
      <ClaimFormGroup label={this.props.label || _.string.humanize(this.props.name)} width={this.props.width}>
        <ClaimInput type="text" {...this.props} />
      </ClaimFormGroup>
    );
  }
});

var ClaimDateGroup = React.createClass({
  render: function() {
    var name = this.props.baseName ? this.props.baseName+'.'+this.props.name : this.props.name;

    return (
      <ClaimFormGroupUnwrapped label={this.props.label || _.string.humanize(this.props.name)}>
        <div className="col-md-4">
          <ClaimInput type="text" {...this.props} />
        </div>
        <div className="col-md-1">
          <label className="btn btn-primary btn-block">
            <i className="fa fa-chevron-down" />
            <Pickadate className="hide" name={name} value={this.props.value || this.props.store.get('name')} readOnly birthday={this.props.birthday} onChange={this.props.onChange} />
          </label>
        </div>
      </ClaimFormGroupUnwrapped>
    );
  }
});

var ClaimFormGroupUnwrapped = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label className="control-label col-md-2" htmlFor={this.props.htmlFor}>{this.props.label || _.string.humanize(this.props.name)}</label>
        {this.props.children}
      </div>
    );
  }
});

var ClaimFormGroup = React.createClass({
  render: function() {
    return (
      <ClaimFormGroupUnwrapped {...this.props}>
        <div className={"col-md-"+(this.props.width || 4)}>
          {this.props.children}
        </div>
      </ClaimFormGroupUnwrapped>
    );
  }
});

var ClaimDiagnoses = React.createClass({
  diagnosisChanged: function(i, ev) {
    this.props.actions.updateFields([
      [['diagnoses', i, ev.target.name], ev.target.value]
    ]);
  },

  removeDiagnosis: function(i) {
    this.props.actions.removeDiagnosis(i);
  },

  newDiagnosis: function() {
    this.props.actions.newDiagnosis();
  },

  render: function() {
    return (
     <div>
            {
             _.map(this.props.store.get('diagnoses').toJS(), function(diagnosis, i) {
               return (
                 <div className="form-group" key={diagnosis.uuid}>
                 {
                   i==0 ?
                   <label className="control-label col-md-2">Diagnoses</label> :
                   <div className="col-md-2"></div>
                 }
                   <div className="col-md-4">
                     <ClaimInputWrapper name="name" store={this.props.store}>
                       <Typeahead name="name" engine={diagnosesEngine} value={diagnosis.name} onChange={this.diagnosisChanged.bind(this, i)} />
                     </ClaimInputWrapper>
                   </div>
                   <div className="col-md-1">
                     <button className="btn btn-danger" onClick={this.removeDiagnosis.bind(this, i)}>
                       <i className="fa fa-close"/>
                     </button>
                   </div>
                 </div>
               );
             }, this)
            }
      <div className="form-group">
        <div className="col-md-4 col-md-offset-2">
          <button className="btn btn-success" onClick={this.newDiagnosis}>
            <i className="fa fa-plus"/>
          </button>
        </div>
      </div>
     </div>
    );
  }
});

var ClaimForm = React.createClass({
  mixins: [
    Fynx.connect(claimStore, 'store'),
  ],

  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  checkboxChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.checked]]);
  },

  actions: function(i) {
    this.itemActions = this.itemActions || [];
    if (this.itemActions[i]) return this.itemActions[i];

    var claimActions = this.props.actions;

    this.itemActions[i] = Fynx.createActions([
      'updateFields',
      'newItem',
      'removeItem',
      'newPremium',
      'removePremium'
    ]);

    this.itemActions[i].updateFields.listen(function(data) {
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

    this.itemActions[i].newItem.listen(function(data) {
      console.log('newItem', data);
      claimActions.newItem({index: i});
    });

    this.itemActions[i].removeItem.listen(function(data) {
      console.log('item removeItem', data);
      claimActions.removeItem({index: i});
    });

    this.itemActions[i].newPremium.listen(function(data) {
      console.log('item newPremium', data);
      claimActions.newPremium({item: i});
    });

    this.itemActions[i].removePremium.listen(function(data) {
      console.log('item removePremium', data);
      claimActions.removePremium({item: i, premium: data.premium});
    });

    return this.itemActions[i];
  },

  render: function() {
    var items = this.state.store.get('daily_details').count() ? this.state.store.get('daily_details').deref().map(function(item, i) {
      return React.createElement(ClaimItem, _.extend({
        store: this.state.store.get('daily_details').get(i),
        actions: this.actions(i),
        index: i,
        key: item.get('uuid'),
      }, item));
     }, this).toJS() : (
      <div className="form-group">
        <div className="col-md-1">
          <button type="button" className="btn btn-block btn-success" onClick={this.props.actions.newItem}>
            <i className="fa fa-plus"/>
          </button>
        </div>
      </div>
    )

    return (
      <div>
        <fieldset>
          <legend>Patient</legend>
          <ClaimFormGroup label="Number">
            <p className="form-control-static">{this.state.store.get('number')}</p>
          </ClaimFormGroup>

          <ClaimFormGroup label="Status">
            <p className="form-control-static">{this.state.store.get('status')}</p>
          </ClaimFormGroup>

          <ClaimFormGroup label="Photo" width={10}>
            <p className="form-control-static">
              <a href={this.state.store.getIn(['photo', 'url'])}>
                <img src={this.state.store.getIn(['photo', 'small_url'])} width="300"/>
              </a>
            </p>
          </ClaimFormGroup>

          <ClaimInputGroup name="patient_name" store={this.state.store} onChange={this.handleChange} />
          <ClaimInputGroup name="patient_number" store={this.state.store} onChange={this.handleChange} />
          <ClaimFormGroup label="Patient Province">
            <ClaimInputWrapper name="patient_province" store={this.state.store}>
              <Select name="patient_province" options={provinces} store={this.state.store} onChange={this.handleChange}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
          <ClaimDateGroup name="patient_birthday" birthday store={this.state.store} onChange={this.handleChange}/>
          <ClaimFormGroup label="Patient Sex">
            <ClaimInputWrapper name="patient_sex" store={this.state.store} onChange={this.handleChange}>
              <RadioSelect name="patient_sex" options={ {F: 'Female', M: 'Male'} } store={this.state.store} onChange={this.handleChange}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
        </fieldset>
        <fieldset>
          <legend>Claim</legend>
          <ClaimFormGroup name="hospital">
            <ClaimInputWrapper store={this.state.store} name="hospital">
              <Typeahead store={this.state.store} id="input_hospital" name="hospital" engine={hospitalsEngine} value={this.state.store.get('hospital')} onChange={this.handleChange}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
          <ClaimInputGroup name="referring_physician" store={this.state.store} onChange={this.handleChange} />
          <ClaimDiagnoses store={this.state.store} actions={this.props.actions} onChange={this.handleChange} />
          <ClaimDateGroup name="admission_on" store={this.state.store} onChange={this.handleChange}/>
          <ClaimDateGroup name="first_seen_on" store={this.state.store} onChange={this.handleChange}/>
          <ClaimDateGroup name="last_seen_on" store={this.state.store} onChange={this.handleChange}/>
          <ClaimDateGroup name="procedure_on" store={this.state.store} onChange={this.handleChange}/>
          <ClaimFormGroup label="Manual Review" htmlFor="manual_review_indicator">
            <ClaimInputWrapper store={this.state.store} name="manual_review_indicator">
              <input name="manual_review_indicator" id="manual_review_indicator" type="checkbox" selected={this.state.store.get('manual_review_indicator')} onChange={this.checkboxChanged} />
            </ClaimInputWrapper>
          </ClaimFormGroup>
          <ClaimFormGroup label="Service Location">
            <ClaimInputWrapper store={this.state.store} name="service_location">
              <Typeahead value={this.state.store.get('service_location')} name="service_location" engine={serviceLocationsEngine} onChange={this.handleChange} />
            </ClaimInputWrapper>
          </ClaimFormGroup>
        </fieldset>

        <fieldset>
          <legend>Items</legend>
          <div className="form-group">
            {items}
            <div className="col-md-3 col-md-offset-8">
             <div className="row">
              <input className="form-control" readOnly value={
               (_.reduce(this.state.store.get('daily_details').toJS(), function(memo, item) {
                 return memo + parseInt(item.fee) +
                   _.reduce(item.premiums || [], function(memo, premium) {
                     return memo + parseInt(premium.fee);
                   }, 0);
               }, 0) / 100).toFixed(2)
              } />
             </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Comments</legend>
          {
           _.map(this.props.comments || [], function(comment, i) {
             return (
               <div className="form-group" key={'comment-'+i}>
                 <div className="control-label col-md-2">
                   <label>{moment(comment.created_at).fromNow()}</label>
                   <p className="text-muted">{comment.user_name}</p>
                 </div>
                 <div className="col-md-10">
                   <p className="form-control-static">
                     {comment.body}
                   </p>
                 </div>
               </div>
             );
           })
          }
          <ClaimInputGroup {...this.props} name="comment" store={this.state.store} />
        </fieldset>

        <ClaimErrors data={this.state.store.get('validations')} name="Warnings"/>
        <ClaimErrors data={this.state.store.get('warnings')} name="Warnings"/>
        <ClaimErrors data={this.state.store.get('errors')} name="Errors"/>
      </div>
    );
  },

});
/*
$(document).on("page:change", function() {
    var $content = $("#content");
    if ($content.length > 0) {
        React.render(
            <ClaimEdit/>,
            $content[0]
        );
    }
});
*/
