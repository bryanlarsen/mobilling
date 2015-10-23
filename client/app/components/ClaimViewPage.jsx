import { ClaimSubmitButtons, ClaimView, ClaimHeader } from '../components';

export default React.createClass({
  render: function() {
    return (
      <div className="body">
        <div className="container with-bottom">
          <div className="form-horizontal">
            <ClaimHeader {...this.props} />
            <ClaimView {...this.props} />
          </div>
        </div>
      </div>
    );
      <ClaimSubmitButtons {...this.props} />
  }
});
