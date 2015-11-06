const ClaimPatient = require('../components/ClaimPatient');
const { claimChangeHandler } = require('../actions');

class NativePatientPage extends React.Component {
  render() {
    const handler = claimChangeHandler.bind(null, this.props.dispatch, this.props.claim.id);
    return <div className="form-horizontal">
      <ClaimPatient {...this.props} store={this.props.claim} onChange={handler}/>
    </div>;
  }
};

module.exports = NativePatientPage;
