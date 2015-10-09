var ClaimInputGroup = React.createClass({
  render: function() {
    return (
      <ClaimFormGroup label={this.props.label || s.humanize(this.props.name)} width={this.props.width}>
        <ClaimInput type="text" {...this.props} />
      </ClaimFormGroup>
    );
  }
});

var ClaimFormGroupUnwrapped = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <label className="control-label col-md-4" htmlFor={this.props.htmlFor}>{this.props.label || s.humanize(this.props.name)}</label>
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

