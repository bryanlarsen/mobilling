var YesNo = React.createClass({
  _onClick: function(val) {
    var props = this.props;
    return function(ev) {
      props.onChange({target: {name: props.name, value: val}});
    };
  },

  render: function() {
    return (
      <div className="btn-group">
        <button className={"btn btn-default"} onClick={this._onClick(!this.props.on)} disabled={this.props.disabled}>
          <i className={"fa " + (this.props.on ? 'fa-check-square-o' : 'fa-square-o')} />
        </button>
        <button className={"btn btn-default "+(this.props.on ? 'btn-primary' : '')} onClick={this._onClick(true)} disabled={this.props.disabled}>
          Yes
        </button>
        <button className={"btn btn-default "+(this.props.on ? '': 'btn-primary')} onClick={this._onClick(false)} disabled={this.props.disabled}>
          No
        </button>
      </div>
    );
  }
});

var ClaimYesNo = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[this.props.name], ev.target.value]]);
  },

  render: function() {
    return (
      <ClaimInputWrapper {...this.props}>
        <YesNo name={this.props.name} on={this.props.store.get(this.props.name)} onChange={this.props.onChange || this.handleChange}/>
      </ClaimInputWrapper>
    );
  }
});
