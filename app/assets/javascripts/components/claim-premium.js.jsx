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

  render: function() {
    return (
      <div className="form-group row">
        <div className="control-label col-sm-2 hidden-xs">Premium</div>
        <div className="col-sm-10 col-md-4">
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
        {this.props.agent && <div className="col-md-3 hidden-sm hidden-xs">
          <ClaimInput name='units' store={this.props.store} onChange={this.unitsChanged} />
        </div>}
        {this.props.agent && <div className="col-md-3 hidden-sm hidden-xs">
          <ClaimInput name='fee' value={(this.props.store.get('fee')/100).toFixed(2)} store={this.props.store} onChange={this.feeChanged} />
        </div>}
      </div>
    );

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

