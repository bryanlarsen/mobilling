import { AdminClaimForm, AdminClaimStatusActions, ClaimView } from '../components';
import { refreshClaim, claimChangeHandler } from '../actions';
import { connect } from 'react-redux';

@connect((state) => state)
class AdminClaimEdit extends React.Component {
  componentDidMount() {
    this.props.dispatch && this.props.dispatch(refreshClaim(this.props.params.id));
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.props.dispatch(refreshClaim(this.props.params.id));
    }
  }

  render() {
    const claim = this.props.claimStore.claims[this.props.params.id];
    const handler = claimChangeHandler.bind(null, this.props.dispatch, claim.id);
    var claimHref = function(id) {
      return "/admin/claims/"+id+"/edit";
    };

    if (["saved", "for_agent", "doctor_attention"].indexOf(claim.status) >= 0) {
      return (
        <div className="form-horizontal">
          <AdminClaimForm {...this.props} store={claim} claim={claim} onChange={handler} claimHref={claimHref} />
          <AdminClaimStatusActions {...this.props} store={claim} claim={claim} onChange={handler} claimHref={claimHref} stack={this.props.claimStore.stack} />
        </div>
      );
    } else {
      return (
        <div className="form-horizontal">
          <ClaimView {...this.props} store={claim} claim={claim} onChange={handler} claimHref={claimHref} />
          <AdminClaimStatusActions {...this.props} store={claim} claim={claim} onChange={handler} claimHref={claimHref} stack={this.props.claimStore.stack} />
        </div>
      );
    }
  }
};

export default AdminClaimEdit;
