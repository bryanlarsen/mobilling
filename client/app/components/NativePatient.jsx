import { ClaimPatient } from '../components';
import { claimChangeHandler } from '../actions';

class NativePatient extends React.Component {
  render() {
    const claim = this.props.claimStore.claims[this.props.params.id];
    if (!claim) return false;
    const handler = claimChangeHandler.bind(null, this.props.dispatch, claim.id);
    return <ClaimPatient {...this.props} store={claim} claim={claim} onChange={handler}/>;
  }
};

export default NativePatient;
