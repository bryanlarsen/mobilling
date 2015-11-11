const ClaimTab = require('../components/ClaimTab');
const { claimChangeHandler } = require('../actions');

class NativeClaimPage extends React.Component {
  render() {
    const handler = claimChangeHandler.bind(null, this.props.dispatch, this.props.claim);
    return <div className="form-horizontal">
      <ClaimTab {...this.props} store={this.props.claim} onChange={handler}/>
    </div>;
  }
};

module.exports = NativeClaimPage;
