const s = require('underscore.string');
const ClaimInputWrapper = require('./ClaimInputWrapper');

module.exports = React.createClass({
  render: function() {
    var value = this.props.value || (this.props.store && this.props.store[this.props.name]);

    if (!value) return null;
    if (value === true) value="✓";
    return (
      <div className="row">
        <div className="col-md-4 static-label">{this.props.label || s.humanize(this.props.name)}</div>
        <div className="col-md-8">
          <ClaimInputWrapper {...this.props}>
            {value}
          </ClaimInputWrapper>
        </div>
      </div>
    );
  }
});
