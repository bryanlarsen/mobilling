import _ from 'underscore';
import { Link } from 'react-router';
import { pushState } from 'redux-router';

import { removeClaim } from '../actions/claimActions';
import Icon from '../components/Icon';
import dollars from '../data/dollars';
import claimTotal from '../data/claimTotal';

export default React.createClass({
  clickRow: function(id, ev) {
    ev.preventDefault();
    this.props.dispatch(pushState(null, `/claim/${id}/patient`));
  },

  clickDelete: function(id, index, ev) {
    ev.preventDefault();
    if (confirm(`Are you sure you really wish to delete claim ${this.props.claims[index].number}?`)) {
      this.props.dispatch(removeClaim(id));
    }
  },

  render: function() {
    var wide = $(document).width() >= 800;

    var claims = this.props.claims.map(function(claim, index) {
      var id = claim.id;
      var clicker = this.clickRow.bind(this, id);
      var del = this.clickDelete.bind(this, id, index);

      return (
        <tr key={id}>
          {wide && <td onClick={clicker}>{claim.number}</td>}
          {false && <td onClick={clicker}>{claim.status}</td>}
          <td onClick={clicker}>{claim.service_date}{claim.unread_comments ? <span className="badge"> {claim.unread_comments}</span> : ' '}</td>
          <td onClick={clicker}>{claim.patient_name}</td>
          <td onClick={clicker}>{dollars(claim.total_fee || claimTotal(claim))}</td>
          {wide && <td onClick={clicker}>{dollars(claim.paid_fee)}</td>}
          {claim.status === 'saved' && <td><button className="btn btn-danger btn-sm" onClick={del}><Icon i="trash-o" /></button></td>}
        </tr>
      );
    }, this);

    var columns = {number: "Claim", service_date: "Date", patient_name: "Name", total_fee: "Total", paid_fee: "Paid"};
    if (!wide) columns = _.pick(columns, 'service_date', 'patient_name', 'total_fee');

    var headers = _.map(columns, function(name, column) {
      var query = _.omit(this.props.location.query, 'page');
      var sort = query.sort || "";
      var desc = sort[0] === '-';
      var widget;
      if (desc) sort = sort.slice(1);
      if (sort === column) {
        query.sort = desc ? column : '-'+column;
        widget = desc ? "▾": "▴";
      } else {
        query.sort = '-'+column;
      }
      return <th key={column}>
          <Link to="/claims" query={query}>{widget}&nbsp;{name}</Link>
      </th>;
    }, this);

    return (
    <div>
      <table className="table table-hover table-striped with-bottom">
        <thead>
           <tr>
             {headers}
          </tr>
        </thead>
        <tbody>
          {claims}
        </tbody>
      </table>
      <nav>
      </nav>
    </div>
    );
  }
});
