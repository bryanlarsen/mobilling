var ClaimItemCollapse = React.createClass({
  expand: function() {
    this.props.expand(this.props.index);
  },

  collapse: function() {
    this.props.expand(-1);
  },

  render: function() {
    if (!this.props.expanded || this.props.readonly) {
      return (
        <ClaimItemSummary {...this.props} onClick={this.expand} />
      );
    } else {
      return (
        <ClaimItem {...this.props} done={this.collapse} />
      );
    }
  }
});

var ClaimItemSummary = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  render: function() {
    var needs_diagnosis = true;
    var feeGenerator = this.state.globalStore.get('feeGenerator');
    if (feeGenerator) {
      needs_diagnosis = feeGenerator.needsDiagnosis(this.props.store.getIn(['rows', 0, 'code']));
    }
    return (
      <div className="well col-xs-12" onClick={this.props.onClick}>
        <div key='code-message'>{this.props.store.get('message')}</div>
        { this.props.store.get('rows').map(function(row, i) {
          return (
            <div key={'row-'+i}>
              {!this.props.silent && <span>{row.get('units')}x </span>}
              <span>{row.get('code')}</span>
              <span className="pull-right">{dollars(row.get('fee'))}</span>
              {row.get('paid') && <span className="pull-right">{dollars(row.get('paid'))+'/'}</span>}
              <div>{row.get('message')}</div>
            </div>
          );
        }, this).toJS()
        }
        <div>
          <span>{this.props.store.get('time_in')}-{this.props.store.get('time_out')}</span>
          {needs_diagnosis && <span> {this.props.store.get('diagnosis')}</span>}
        </div>
      </div>
    );
  }
});

var NewItemButton = React.createClass({
  click: function() {
    var template = {
      day: normalizeDate(''),
      premiums: [],
      uuid: uuid()
    };
    if (this.props.index !== undefined) {
      var item = this.props.store.getIn(['items', this.props.index]);
      template.day = item.get('day');
      template.time_in = item.get('time_in');
      template.time_out = item.get('time_out');
    }
    this.props.actions.newItem({template: template, index: this.props.index});
    this.props.expand((this.props.index === undefined ? -1 : this.props.index) + 1);
  },

  render: function() {
    return (
      <div className="form-group row" key="new-code-button">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          <button type="button" className="btn btn-block btn-success" onClick={this.click}>
            <i className="fa fa-plus"/> Add a new code
          </button>
        </div>
      </div>
    );
  }
});

var ClaimItem = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

  fieldChanged: function(ev) {
    this.props.actions.updateFields([
      [[ev.target.name], ev.target.value],
      [['fee'], "*recalculate"],
    ]);
  },

  unitsChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], parseInt(ev.target.value)]]);
  },

  feeChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], Math.round(Number(ev.target.value)*100)]]);
  },

  codeChanged: function(ev) {
    var value = ev.target.value;
    var feeGenerator = this.state.globalStore.get('feeGenerator');
    if (!feeGenerator) return false;

    messages = feeGenerator.validateCode(value);
    var updates = [
      [['validations'], messages ? Immutable.fromJS({'code': messages}) : Immutable.fromJS({})],
      [['code'], value],
    ];
    if (!messages) {
      updates.push([['fee'], "*recalculate"]);
    }
    this.props.actions.updateFields(updates);
  },

  diagnosisChanged: function(ev) {
    this.props.actions.updateFields([[['diagnosis'], ev.target.value]]);
  },

  actions: function(i) {
    var that = this;
    this.premiumActions = this.premiumActions || [];
    if (this.premiumActions[i]) return this.premiumActions[i];

    var itemActions = this.props.actions;

    this.premiumActions[i] = Fynx.createActions([
      'updateFields',
      'removePremium',
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

    return this.premiumActions[i];
  },

  newPremium: function(ev) {
    console.log('click newPremium');
    this.props.actions.newPremium();
  },

  render: function() {
    var rows = this.props.store.get('rows') ? this.props.store.get('rows').map(function(item, i) {
      return React.createElement(ClaimRow, _.extend({
        store: this.props.store.get('rows').get(i),
        actions: this.actions(i),
        key: item.get('uuid'),
        silent: this.props.silent,
      }, item));
    }, this).toJS() : null;

    var feeGenerator = this.state.globalStore.get('feeGenerator');
    var needs_diagnosis = true;
    if (feeGenerator) {
      needs_diagnosis = feeGenerator.needsDiagnosis(this.props.store.getIn(['rows', 0, 'code']));
    }

    return (
    <div>
      <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Date</div>
        <div className="col-sm-8 col-md-4">
          <ClaimDate {...this.props} name='day' onChange={this.fieldChanged} />
        </div>
      </div>


      { rows }

      <div className="form-group row">
        <div className="col-sm-8 col-md-4 col-sm-offset-4">
          <button type="button" className="btn btn-block btn-success" onClick={this.newPremium}>
            <i className="fa fa-asterisk"/> Add a code
          </button>
        </div>
      </div>

      {needs_diagnosis && <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Diagnosis</div>
        <div className="col-sm-8 col-md-4">
          <Typeahead name="diagnosis" engine={diagnosesEngine} value={this.props.store.get('diagnosis')} onChange={this.fieldChanged} />
        </div>
      </div>}

      <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Time</div>
        <div className="control-label col-xs-4 visible-xs">In</div>
        <div className="col-xs-8 col-sm-4 col-md-2">
          <ClaimTime {...this.props} name='time_in' onChange={this.fieldChanged} max={this.props.store.get('time_out')}/>
        </div>
        <div className="control-label col-xs-4 visible-xs">Out</div>
        <div className="col-xs-8 col-sm-4 col-md-2">
          <ClaimTime {...this.props} name='time_out' onChange={this.fieldChanged} min={this.props.store.get('time_in')}/>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-xs-4 col-sm-4 control-label">{dollars(itemTotal(this.props.store.toJS()))}</div>
        <div className="col-xs-8 col-sm-8 col-md-4">
          <button className="btn btn-info btn-block" onClick={this.props.done}>
            <i className="fa fa-check" /> OK
          </button>
        </div>
      </div>

    </div>
    );

  }
});

var ClaimItemList = React.createClass({
  getInitialState: function() {
    return {
      expanded: -1
    };
  },

  expand: function(item) {
    this.setState({expanded: item});
  },

  render: function() {
    var items = this.props.store.get('items');
    var lastIndex;
    if (items.count()) {
      var days = _.uniq(items.map(function(item) {
        return item.get('day');
      }).toJS().sort(), true);
      return React.createElement("div",
                                 {},
                                 days.map(function(day) {
        return (
          <div key={'item-day-'+day}>
            <div className="col-xs-12 day-header" key={"day-header-"+day}>
              <span>{day}</span>
              <span className="pull-right">{
                dollars(items.reduce(function(memo, item) {
                  return item.get('day') === day ? memo + itemTotal(item.toJS()) : memo;
                }, 0))
              }</span>
            </div>
            <div key={"day-body-"+day}>
             {items.map(function(item, i) {
               if (item.get('day') === day) {
                 lastIndex = i;
                 return React.createElement(ClaimItemCollapse, {
                   claimStore: this.props.store,
                   store: this.props.store.get('items').get(i),
                   actions: itemActionsFor(this.props.store.get('id'), i),
                   index: i,
                   key: item.get('uuid'),
                   silent: this.props.silent,
                   expanded: this.state.expanded === i,
                   expand: this.expand,
                   readonly: this.props.readonly
                 }, item);
               } else {
                 return null;
               }
              }, this).toJS()
            }
            </div>
            {this.props.readonly ? null : <NewItemButton key={"day-button-"+day} index={lastIndex} actions={this.props.actions} expand={this.expand} store={this.props.store}/>}
          </div>
        )
      }, this));
    } else if (!this.props.readonly) {
      return <NewItemButton actions={this.props.actions} expand={this.expand} store={this.props.store} />;
    } else {
      return null;
    }
  }
});

