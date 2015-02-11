var ClaimTime = React.createClass({
  onTextChange: function(ev) {
    var re = /^([0-9]{0,2}?)[.:]?([0-9]{0,2})$/;
    var match = ev.target.value.match(re);
    if (!match) {
      ev.target.value = "00:00";
      this.props.onChange(ev);
    }
    var zf = function(s) { return ('00' + s).slice(-2); };
    ev.target.value = zf(match[1])+':'+zf(match[2]);
    this.props.onChange(ev);
  },

  render: function() {
    return (
      <ClaimInputWrapper {...this.props}>
        <div className="input-group">
          <ClaimInputInner type="text" {...this.props} onChange={this.onTextChange}/>
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
