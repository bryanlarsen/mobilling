export default React.createClass({
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