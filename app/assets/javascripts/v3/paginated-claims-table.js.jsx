var PaginatedClaimsTable = React.createClass({
  mixins: [ ReactRouter.Navigation, ReactRouter.State ],

  clickRow: function(id, ev) {
    ev.preventDefault();
    this.transitionTo('claim_patient', {id: id});
  },

  clickDelete: function(id, index, ev) {
    ev.preventDefault();
    if (confirm("Are you sure you really wish to delete claim "+this.props.claims.getIn([index, 'number'])+"?")) {
      claimActions.remove(id);
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.claims.size !== 0;
  },

  render: function() {
    var wide = $(document).width() >= 800;

    var claims = this.props.claims.map(function(claim, index) {
      var id = claim.get('id');
      var clicker = this.clickRow.bind(this, id);
      var del = this.clickDelete.bind(this, id, index);

      return (
        <tr key={id}>
          {wide && <td onClick={clicker}>{claim.get('number')}</td>}
          {wide && <td onClick={clicker}>{claim.get('status')}</td>}
          <td onClick={clicker}>{claim.get('service_date')}</td>
          <td onClick={clicker}>{claim.get('patient_name')}</td>
          <td onClick={clicker}>{dollars(claim.get('total_fee'))}</td>
          {wide && <td onClick={clicker}>{dollars(claim.get('paid_fee'))}</td>}
          {claim.get('status') === 'saved' && <td><button className="btn btn-danger btn-sm" onClick={del}><Icon i="trash-o" /></button></td>}
        </tr>
      );
    }, this).toJS();

    var columns = {number: "Claim", status: "Status", service_date: "Date", patient_name: "Name", total_fee: "Total", paid_fee: "Paid"};
    if (!wide) columns = _.pick(columns, 'service_date', 'patient_name', 'total_fee');

    var headers = _.map(columns, function(name, column) {
      var query = _.omit(this.getQuery(), 'page');
      var sort = query.sort || "";
      var desc = sort[0] === '-';
      var widget;
      if (desc) sort = sort.slice(1);
      if (sort === column) {
        query.sort = desc ? column : '-'+column;
        widget = <i className={desc ? "fa fa-sort-desc" : "fa fa-sort-asc"} />;
      } else {
        query.sort = '-'+column;
      }
      return <th key={column}>
          <Link to="claims" query={query}>{name}{widget}</Link>
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
