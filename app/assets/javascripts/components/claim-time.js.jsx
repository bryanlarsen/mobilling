var ClaimTime = React.createClass({
  render: function() {
    return (
      <ClaimInputWrapper {...this.props}>
        <div className="input-group">
          <ClaimInputInner type="text" {...this.props} />
          <span className="input-group-btn">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
              <Pickatime className="hide" name={this.props.name} value={this.props.value || this.props.store.get(this.props.name)} readOnly onChange={this.props.onChange} max={this.props.max} min={this.props.min}/>
            </label>
          </span>
        </div>
      </ClaimInputWrapper>
    );
  }
});
