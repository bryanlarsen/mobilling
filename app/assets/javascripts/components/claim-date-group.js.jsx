var ClaimDate = React.createClass({
  render: function() {
    return (
      <ClaimInputWrapper type="text" {...this.props}>
        <div className="input-group">
          <ClaimInputInner type="text" {...this.props} />
          <span className="input-group-btn">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickadate className="hide" name={this.props.name} value={this.props.value || this.props.store.get(this.props.name)} readOnly birthday={this.props.birthday} onChange={this.props.onChange} />
            </label>
          </span>
        </div>
      </ClaimInputWrapper>
    );
  }
});

var ClaimDateGroup = React.createClass({
  render: function() {
    return (
      <ClaimFormGroup label={this.props.label || _.string.humanize(this.props.name)}>
        <ClaimDate {...this.props}/>
      </ClaimFormGroup>
    );
  }
});

