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
 }

var ClaimEdit = React.createClass({
  getInitialState: function(event) {
    this.initialClaim = _.omit(this.props.claim, 'warnings', 'errors');
    return {
      claim: this.initialClaim,
      unsaved: false,
      changed: false,
      warnings: this.props.claim.warnings || {},
      errors: this.props.claim.errors || {},
      validations: {}
    };
  },

  componentDidMount: function() {
    this.feeGenerator = new Promise(function(resolve, reject) {
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

  handleChange: function(event) {
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
  },

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

  // tombstone
/*
  setStateErrors: function(claim) {
    var newState = {
      claim: {
        warnings: {'$set': claim.warnings || {}},
        errors: {'$set': claim.errors || {}},
        daily_details: {}
      }
    };
    _.each(claim.daily_details || [], function(item, i) {
      newState.claim.daily_details[i] = {
        warnings: {'$set': item.warnings || {}},
        errors: {'$set': item.errors || {}},
        premiums: {}
      };

      _.each(item.premiums || [], function(premium, j) {
        newState.claim.daily_details[i].premiums[j] = {
          warnings: {'$set': premium.warnings || {}},
          errors: {'$set': premium.warnings || {}}
        };
      });
    });

    this.setState({warnings: claim.warningReact.addons.update(this.state, newState));
  },
*/
  sync: function(claim, callback) {
    claim = _.omit(claim || this.state.claim, 'warnings', 'errors', 'id', 'number', 'created_at', 'updated_at');
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
    });
  },

  render: function() {
    var cur = this.props.stack.indexOf(this.state.claim.id);
    var next = this.props.stack[cur+1];
    var prev = this.props.stack[cur-1];
    var form = this;
    return (
      <div className="form-horizontal">
        <ClaimForm
          {...this.state.claim}
          errors={this.state.errors}
          warnings={this.state.warnings}
          validations={this.state.validations}
          handleChange={this.handleChange}
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

             var disabled = this.state.unsaved || !_.isEmpty(this.state.errors);
             if (status === 'ready' &&
                 (!_.isEmpty(this.state.validations) ||
                  !_.isEmpty(this.state.warnings))) {
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
    var name = this.props.baseName ? this.props.baseName+'.'+this.props.name : this.props.name;
    var filter = function(data, key) {
      return _.string.startsWith(key, name);
    };
    var messages = [].concat(_.filter(this.props.errors, filter),
                             _.filter(this.props.warnings, filter),
                             _.filter(this.props.validations, filter));

    return (
      <div>
        {this.props.children}
        {
         _.map(_.flatten(messages), function(msg, i) {
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
    var name = this.props.baseName ? this.props.baseName+'.'+this.props.name : this.props.name;

    return (
      <BlurInput type={this.props.type} className={"form-control "+this.props.className} name={name} value={this.props.value || this.props[this.props.name]} onChange={this.props.handleChange} />
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
      component.props.handleChange(event);
    }).on('typeahead:selected', function(event, suggestion, dataset) {
      component.props.handleChange(event);
    });
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).typeahead('destroy');
  },

  render: function() {
    var name = this.props.baseName ? this.props.baseName+'.'+this.props.name : this.props.name;

    return (
      <input type="search" className="form-control typeahead" name={name} defaultValue={this.props.value || this.props[this.props.name]} onBlur={this.props.handleChange}/>
    );
  }
});

var Select = React.createClass({
  render: function() {
    var name = this.props.baseName ? this.props.baseName+'.'+this.props.name : this.props.name;

    return (
      <select className="form-control" value={this.props.value || this.props[this.props.name]} name={name} onChange={this.props.handleChange}>
        { _.map(this.props.options, function(label, code) {
            return (
              <option value={code}>{label}</option>
            );
          }, this)
         }
      </select>
    );
  }
});

var RadioSelect = React.createClass({
  render: function() {
    var name = this.props.baseName ? this.props.baseName+'.'+this.props.name : this.props.name;
    var value = this.props.value || this.props[this.props.name];

    return (
      <div className="btn-group">
        {
         _.map(this.props.options, function(label, code) {
           return (
             <label key={'rg'+name+code} className={"btn btn-default btn-lg "+(value===code ? 'btn-primary' : '')}>
               <input type="radio" id={name+code} value={code} name={name} className="hide" onChange={this.props.handleChange} />
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
  render: function() {
    return (
      <div className="row">
        <div className="col-md-1"/>
        <div className="col-md-4">
          <ClaimInputWrapper {...this.props} name='code'>
            <Typeahead {...this.props} name='code' engine={serviceCodesEngine} handleChange={this.props.recalculate} />
          </ClaimInputWrapper>
        </div>
        <div className="col-md-3">
          <ClaimInput name='units' {...this.props} type="text" />
        </div>
        <div className="col-md-3">
          <ClaimInput name='fee' {...this.props} type="text" value={(this.props.fee/100).toFixed(2)}/>
        </div>
        <div className="col-md-1">
          <button type="button" className="btn btn-block btn-danger" onClick={this.props.removePremium}>
            <i className="fa fa-close"/>
          </button>
        </div>
      </div>
    );
  }
});

var ClaimItem = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <div className="row">
          <div className="col-md-1">
            <button type="button" className="btn btn-block btn-success" onClick={this.props.newItem}>
              <i className="fa fa-plus"/>
            </button>
          </div>
          <div className="col-md-3">
            <ClaimInput name='day' {...this.props} handleChange={this.props.recalculate} type="text" />
          </div>
          <div className="col-md-1">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickadate className="hide" name={this.props.baseName+'.day'} value={this.props.day} readOnly onChange={this.props.recalculate} />
            </label>
          </div>
          <div className="col-md-2">
            <ClaimInput name='time_in' {...this.props} handleChange={this.props.recalculate} type="text" />
          </div>
          <div className="col-md-1">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickatime className="hide" name={this.props.baseName+'.time_in'} value={this.props.time_in} readOnly onChange={this.props.recalculate} max={this.props.time_out} />
            </label>
          </div>
          <div className="col-md-2">
            <ClaimInput name='time_out' {...this.props} handleChange={this.props.recalculate} type="text" />
          </div>
          <div className="col-md-1">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickatime className="hide" name={this.props.baseName+'.time_out'} value={this.props.time_out} readOnly onChange={this.props.recalculate} min={this.props.time_in} />
            </label>
          </div>
          <div className="col-md-1">
            <button type="button" className="btn btn-block btn-danger" onClick={this.props.removeItem}>
              <i className="fa fa-close"/>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-1">
            <button type="button" className="btn btn-block btn-success" onClick={this.props.newPremium}>
              <i className="fa fa-plus"/>
            </button>
          </div>
          <div className="col-md-4">
            <ClaimInputWrapper name='code' {...this.props}>
              <Typeahead {...this.props} name='code' engine={serviceCodesEngine} handleChange={this.props.recalculate} />
            </ClaimInputWrapper>
          </div>
          <div className="col-md-3">
            <ClaimInput name='units' {...this.props} type="text" />
          </div>
          <div className="col-md-3">
            <ClaimInput name='fee' {...this.props} type="text" value={(this.props.fee/100).toFixed(2)}/>
          </div>
        </div>
        { _.map(this.props.premiums, function(premium, i) {
          return React.createElement(ClaimPremium, _.extend({
            baseName: this.props.baseName + '.premiums.'+i,
            index: i,
            key: this.props.baseName + '.premiums.'+i,
            handleChange: this.props.handleChange,
            claim: this.props.claim,
            form: this.props.form,
            removePremium: this.props.removePremium.bind(this.props.form, this.props.index, i),
            recalculate: this.props.recalculate.bind(this.props.form, i),
            errors: this.props.errors,
            warnings: this.props.warnings,
            validations: this.props.validations,
          }, premium));
         }, this)
        }
      </div>
    );
  }
});

var ClaimErrors = React.createClass({
  render: function() {
    if (_.isEmpty(this.props.data)) return null;
    return (
      <fieldset>
        <legend>{this.props.name}</legend>

        {
         _.map(this.props.data, function(errs, name) {
           return (
        <div className="form-group" key={'err-'+this.props.name+'-'+name}>
          <label className="control-label col-md-2">{_.string.humanize(name)}</label>
          <div className="col-md-10">
          { _.map(errs, function(err, i) {
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
         }, this)
         }
      </fieldset>
    );
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
            <Pickadate className="hide" name={name} value={this.props.value || this.props[this.props.name]} readOnly birthday={this.props.birthday} onChange={this.props.handleChange} />
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
        <label className="control-label col-md-2">{this.props.label || _.string.humanize(this.props.name)}</label>
        {this.props.children}
      </div>
    );
  }
});

var ClaimFormGroup = React.createClass({
  render: function() {
    return (
      <ClaimFormGroupUnwrapped {...this.props} >
        <div className={"col-md-"+(this.props.width || 4)}>
          {this.props.children}
        </div>
      </ClaimFormGroupUnwrapped>
    );
  }
});

var ClaimDiagnoses = React.createClass({
  render: function() {
    return (
     <div>
      <div className="form-group">
        <label className="control-label col-md-2">Diagnoses</label>
        <div className="col-md-4">
          <button className="btn btn-success" onClick={this.props.form.newDiagnosis}>
            <i className="fa fa-plus"/>
          </button>
        </div>
      </div>
            {
             _.map(this.props.diagnoses || [], function(diagnosis, i) {
               return (
                 <div className="form-group" key={"diagnoses-"+i}>
                   <div className="col-md-4 col-md-offset-2">
                     <ClaimInputWrapper {...this.props} baseName={'diagnoses.'+i} name="name" >
                       <Typeahead {...this.props} baseName={'diagnoses.'+i} name="name" engine={diagnosesEngine} value={diagnosis.name}/>
                     </ClaimInputWrapper>
                   </div>
                   <div className="col-md-1">
                     <button className="btn btn-danger" onClick={this.props.form.removeDiagnoses.bind(this.props.form, i)}>
                       <i className="fa fa-close"/>
                     </button>
                   </div>
                 </div>
               );
             }, this)
            }
      </div>
    );
  }
});

var ClaimForm = React.createClass({
  render: function() {
    return (
      <div>
        <fieldset>
          <legend>Patient</legend>
          <ClaimFormGroup label="Number">
            <p className="form-control-static">{this.props.number}</p>
          </ClaimFormGroup>

          <ClaimFormGroup label="Status">
            <p className="form-control-static">{this.props.status}</p>
          </ClaimFormGroup>

          <ClaimFormGroup label="Photo" width={10}>
            <p className="form-control-static">
              <a href={this.props.photo.url}>
                <img src={this.props.photo.small_url} width="300"/>
              </a>
            </p>
          </ClaimFormGroup>

          <ClaimInputGroup {...this.props} name="patient_name"/>
          <ClaimInputGroup {...this.props} name="patient_number"/>
          <ClaimFormGroup label="Patient Province">
            <ClaimInputWrapper {...this.props} name="patient_province">
              <Select {...this.props} name="patient_province" options={provinces}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
          <ClaimDateGroup {...this.props} name="patient_birthday" birthday />
          <ClaimFormGroup label="Patient Sex">
            <ClaimInputWrapper {...this.props} name="patient_sex">
              <RadioSelect {...this.props} name="patient_sex" options={ {F: 'Female', M: 'Male'} }/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
        </fieldset>
        <fieldset>
          <legend>Claim</legend>
          <ClaimFormGroup label="Hospital">
            <ClaimInputWrapper {...this.props} name="hospital">
              <Typeahead {...this.props} name="hospital" engine={hospitalsEngine}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
          <ClaimInputGroup {...this.props} name="referring_physician"/>
          <ClaimDiagnoses {...this.props}/>
          <ClaimDateGroup {...this.props} name="admission_on"/>
          <ClaimDateGroup {...this.props} name="first_seen_on"/>
          <ClaimDateGroup {...this.props} name="last_seen_on"/>
          <ClaimDateGroup {...this.props} name="procedure_on"/>
          <ClaimInputGroup {...this.props} name="manual_review_indicator" type="checkbox"/>
          <ClaimFormGroup label="Service Location">
            <ClaimInputWrapper {...this.props} name="service_location">
              <Typeahead {...this.props} name="service_location" engine={serviceLocationsEngine}/>
            </ClaimInputWrapper>
          </ClaimFormGroup>
        </fieldset>

        <fieldset>
          <legend>Items</legend>
          { this.props.daily_details.length ? _.map(this.props.daily_details, function(item, i) {
            return React.createElement(ClaimItem, _.extend({
              baseName: 'daily_details.'+i,
              index: i,
              key: 'daily_details.'+i,
              handleChange: this.props.handleChange,
              claim: this.props,
              form: this.props.form,
              newItem: this.props.newItem.bind(this.props.form, item),
              removeItem: this.props.removeItem.bind(this.props.form, i),
              newPremium: this.props.newPremium.bind(this.props.form, i),
              removePremium: this.props.removePremium,
              recalculate: this.props.recalculate.bind(this.props.form, i),
              errors: this.props.errors,
              warnings: this.props.warnings,
              validations: this.props.validations
            }, item));
           }, this) : (
             <div className="form-group">
               <div className="col-md-1">
                 <button type="button" className="btn btn-block btn-success" onClick={this.props.newItem.bind(this.props.form, null)}>
                   <i className="fa fa-plus"/>
                 </button>
               </div>
             </div>
           )}
          <div className="form-group">
            <div className="col-md-3 col-md-offset-8">
             <div className="row">
              <input className="form-control" readOnly value={
               (_.reduce(this.props.daily_details || [], function(memo, item) {
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
          <ClaimInputGroup {...this.props} name="comment"/>
        </fieldset>

        <ClaimErrors data={this.props.validations} name="Warnings"/>
        <ClaimErrors data={this.props.warnings} name="Warnings"/>
        <ClaimErrors data={this.props.errors} name="Errors"/>
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
