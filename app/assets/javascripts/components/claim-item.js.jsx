var ClaimItemCollapse = React.createClass({
  expand: function() {
    this.props.expand(this.props.index);
  },

  collapse: function() {
    this.props.expand(-1);
  },

  render: function() {
    if (!this.props.expanded) {
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
  render: function() {
    return (
      <div className="well col-xs-12" onClick={this.props.onClick}>
        <div key='code'>
          <span>{this.props.store.get('code')}</span>
          <span className="pull-right">{dollars(this.props.store.get('fee'))}</span>
          {!this.props.silent && <span className="pull-right">{this.props.store.get('units')}:&nbsp;</span>}
        </div>
        { this.props.store.get('premiums').map(function(premium, i) {
          return (
            <div key={'premium-'+i}>
              <span>{premium.get('code')}</span>
              <span className="pull-right">{dollars(premium.get('fee'))}</span>
              {!this.props.silent && <span className="pull-right">{this.props.store.get('units')}:&nbsp;</span>}
            </div>
          );
        }, this).toJS()
        }
      </div>
    );
  }
});

var NewItemButton = React.createClass({
  click: function() {
    var template = {
      day: new Date().toISOString().slice(0,10),
      premiums: [],
      uuid: uuid()
    };
    if (this.props.index !== undefined) {
      var item = this.props.store.getIn(['daily_details', this.props.index]);
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
        <div className="col-xs-12 col-md-6">
          <button type="button" className="btn btn-block btn-success" onClick={this.click}>
            <i className="fa fa-plus"/> Add a new code
          </button>
        </div>
      </div>
    );
  }
});

var ClaimItem = React.createClass({
  fieldChanged: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
    this.props.actions.recalculate();
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
    feeGenerator().then(function(gen) {
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
      itemActions.recalculate();
    });

    return this.premiumActions[i];
  },

  newPremium: function(ev) {
    console.log('click newPremium');
    this.props.actions.newPremium();
  },

  render: function() {
    var premiums = this.props.store.get('premiums') ? this.props.store.get('premiums').map(function(premium, i) {
      return React.createElement(ClaimPremium, _.extend({
        store: this.props.store.get('premiums').get(i),
        actions: this.actions(i),
        key: premium.get('uuid'),
        silent: this.props.silent
      }, premium));
    }, this).toJS() : null;

    return (
    <div>
      <div className="form-group row">
        <div className="control-label col-sm-2 hidden-xs">Date</div>
        <div className="col-sm-10 col-md-4">
          <ClaimDate {...this.props} name='day' onChange={this.fieldChanged} />
        </div>
      </div>

      <div className="form-group row">
        <div className="control-label col-sm-2 hidden-xs">Time</div>
        <div className="control-label col-xs-3 visible-xs">In</div>
        <div className="col-xs-9 col-sm-5 col-md-2">
          <ClaimTime {...this.props} name='time_in' onChange={this.fieldChanged} max={this.props.store.get('time_out')}/>
        </div>
        <div className="control-label col-xs-3 visible-xs">Out</div>
        <div className="col-xs-9 col-sm-5 col-md-2">
          <ClaimTime {...this.props} name='time_out' onChange={this.fieldChanged} min={this.props.store.get('time_in')}/>
        </div>
      </div>


      <div className="form-group row">
        <div className="control-label col-sm-2 hidden-xs">Code</div>
        <div className="col-sm-10 col-md-4">
          <ClaimInputWrapper name='code' {...this.props} >
            <div className="input-group">
              <Typeahead name='code' engine={serviceCodesEngine} onChange={this.codeChanged} value={this.props.store.get('code')}/>
              <span className="input-group-btn">
                <button type="button" className="btn btn-danger" onClick={this.props.actions.removeItem}>
                  <i className="fa fa-close"/>
                </button>
              </span>
            </div>
          </ClaimInputWrapper>
        </div>
        {!this.props.silent && <div className="col-md-3">
          <ClaimInput name='units' store={this.props.store} onChange={this.unitsChanged} />
        </div>}
        {!this.props.silent && <div className="col-md-3">
          <ClaimInput name='fee' value={dollars(this.props.store.get('fee'))} store={this.props.store} onChange={this.feeChanged} />
        </div>}
      </div>

      { premiums }

      <div className="form-group row">
        <div className="col-sm-10 col-md-4 col-sm-offset-2">
          <button type="button" className="btn btn-block btn-success" onClick={this.newPremium}>
            <i className="fa fa-asterisk"/> Add a premium code
          </button>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-xs-6 col-sm-2 control-label">{dollars(itemTotal(this.props.store.toJS()))}</div>
        <div className="col-xs-6 col-sm-10 col-md-4">
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
    var items = this.props.store.get('daily_details');
    var lastIndex;
    if (items.count()) {
      var days = _.uniq(items.map(function(item) {
        return item.get('day');
      }).toJS().sort(), true);
      return React.createElement("div",
                                 {},
                                 days.map(function(day) {
        return (
          React.createElement("div", {key: 'item-day-'+day}, [
            <div className="col-xs-12 day-header" key={"day-header-"+day}>
              <span>{day}</span>
              <span className="pull-right">{
                dollars(items.reduce(function(memo, item) {
                  return item.get('day') === day ? memo + itemTotal(item.toJS()) : memo;
                }, 0))
              }</span>
            </div>,
            React.createElement("div", {key: "day-body-"+day},
                                items.map(function(item, i) {
              if (item.get('day') === day) {
                lastIndex = i;
                return React.createElement(ClaimItemCollapse, {
                  claimStore: this.props.store,
                  store: this.props.store.get('daily_details').get(i),
                  actions: itemActionsFor(this.props.store.get('id'), i),
                  index: i,
                  key: item.get('uuid'),
                  silent: this.props.silent,
                  expanded: this.state.expanded === i,
                  expand: this.expand
                }, item);
              } else {
                return <div/>;
              }
            }, this).toJS()),
            <NewItemButton key={"day-button-"+day} index={lastIndex} actions={this.props.actions} expand={this.expand} store={this.props.store}/>
          ])
        );
      }, this));
    } else {
      return <NewItemButton actions={this.props.actions} expand={this.expand} store={this.props.store} />
    }
  }
});

