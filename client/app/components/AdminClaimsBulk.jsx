import _ from 'underscore';
import ClaimView from '../components/ClaimView';
import AdminClaimBulkActions from '../components/AdminClaimBulkActions';
import { Button, ButtonGroup } from 'react-bootstrap';
import { userChangeHandler } from '../actions/claimActions';
import { connect } from 'react-redux';

export default connect((state) => state)(
class AdminClaimsBulk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedIds: props.claimStore.claimList};
  }

  changeCheckbox(ev) {
    if (ev.target.checked) {
      this.setState({selectedIds: this.state.selectedIds.concat(ev.target.value)});
    } else {
      this.setState({selectedIds: _.without(this.state.selectedIds, ev.target.value)});
    }
  }

  selectAll(ev) {
    this.setState({selectedIds: this.props.claimStore.claimList});
  }

  deselectAll(ev) {
    this.setState({selectedIds: []});
  }

  render() {
    var claimHref = function(id) {
      return "/admin/claims/"+id+"/edit";
    };

    var status = this.props.params.status;

    var cards = _.map(this.props.claimStore.claimList, (id) => {
      const claim = this.props.claimStore.claims[id];
      var claimHref = function(id) {
        return "/admin/claims/"+id+"/edit";
      };

      if (claim.status !== status) status = "none";

      return (
        <div className="claim-card" key={id}>
          <input type="checkbox" checked={this.state.selectedIds.indexOf(id) >= 0} onChange={this.changeCheckbox} value={id}/>
          <div className="form-horizontal">
            <ClaimView {...this.props} store={claim} claim={claim} claimHref={claimHref} readonly />
          </div>
        </div>
      );
    });

    return (
      <div>
        <AdminClaimBulkActions {...this.props} status={status} ids={this.state.selectedIds} />
        <div className="no-print">
          <ButtonGroup>
            <Button onClick={this.selectAll.bind(this)}>Select All</Button>
            <Button onClick={this.deselectAll.bind(this)}>Deselect All</Button>
          </ButtonGroup>
        </div>
        {cards}
      </div>
    );
  }
});
