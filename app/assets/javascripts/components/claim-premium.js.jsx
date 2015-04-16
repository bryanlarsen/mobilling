var ClaimPremium = React.createClass({
  mixins: [
    Fynx.connect(globalStore, 'globalStore'),
  ],

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

  render: function() {
    return (
      <div className="form-group row">
        <div className="control-label col-sm-4 hidden-xs">Premium</div>
        <div className="col-sm-8 col-md-4">
          <ClaimInputWrapper name='code' {...this.props} >
            <div className="input-group">
              <Typeahead name='code' engine={serviceCodesEngine} onChange={this.codeChanged} value={this.props.store.get('code')}/>
              <span className="input-group-btn">
                <button type="button" className="btn btn-danger" onClick={this.props.actions.removePremium}>
                  <i className="fa fa-close"/>
                </button>
              </span>
            </div>
          </ClaimInputWrapper>
        </div>
        {!this.props.silent && <div className="col-md-2 col-md-offset-0 col-xs-4 col-xs-offset-4">
          <ClaimInput name='units' store={this.props.store} onChange={this.unitsChanged} />
        </div>}
        {!this.props.silent && <div className="col-md-2 col-xs-4">
          <ClaimInput name='fee' value={(this.props.store.get('fee')/100).toFixed(2)} store={this.props.store} onChange={this.feeChanged} />
        </div>}
      </div>
    );
  }
});

