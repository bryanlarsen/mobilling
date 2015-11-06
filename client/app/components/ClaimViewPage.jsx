const ClaimSubmitButtons = require('./ClaimSubmitButtons');
const ClaimView = require('./ClaimView');
const ClaimHeader = require('./ClaimHeader');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="body">
        <div className="container with-bottom">
          <div className="form-horizontal">
            <ClaimHeader {...this.props} />
            <ClaimSubmitButtons {...this.props} />
            <ClaimView {...this.props} />
          </div>
        </div>
      </div>
    );
  }
});
