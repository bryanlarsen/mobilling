import { ClaimPage, ClaimViewPage, LoadingPage } from '../components';
import { refreshClaim, claimChangeHandler } from '../actions';
import { connect } from 'react-redux';

@connect((state) => state)
class ClaimPageSelect extends React.Component {
  componentDidMount() {
    this.props.dispatch && this.props.dispatch(refreshClaim(this.props.params.id));
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.props.dispatch(refreshClaim(this.props.params.id));
    }
  }

  render() {
    const claimHref = function(id) {
      return "/claim/"+id+"/patient";
    };

    const claim = this.props.claimStore.claims[this.props.params.id];
    if (!claim || !claim.patient_sex) {
      return <LoadingPage {...this.props} />;
    }
    const handler = claimChangeHandler.bind(null, this.props.dispatch, claim.id);

    if (['saved', 'doctor_attention'].indexOf(claim.status) !== -1) {
      return <ClaimPage {...this.props} store={claim} claim={claim} onChange={handler} claimHref={claimHref} />;
    } else {
      return <ClaimViewPage {...this.props} store={claim} claim={claim} onChange={handler} claimHref={claimHref} />;
    }
  }
};

export default ClaimPageSelect;
