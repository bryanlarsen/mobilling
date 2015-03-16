var ClaimList = React.createClass({
  mixins: [ ReactRouter.Navigation,
    Fynx.connect(claimListStore, 'store'),
    Fynx.connect(claimStore, 'claimStore'),
    Fynx.connect(claimAbbreviatedStore, 'abbreviatedStore'),
  ],

  clickRow: function(id, ev) {
    ev.preventDefault();
    this.transitionTo('claim_patient', {id: id});
  },

  clickDelete: function(id, index, ev) {
    ev.preventDefault();
    if (confirm("Are you sure you really wish to delete claim "+this.props.store.getIn([index, 'number'])+"?")) {
      claimActions.remove(id);
    }
  },

  filters: {
    drafts: ["saved"],
    submitted: ["for_agent", "ready", "file_created", "uploaded", "acknowledged", "agent_attention"],
    rejected: ["doctor_attention"],
    done: ["done"]
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.store.size !== 0;
  },

/*  componentDidMount: function() {
    var self = this;
    console.log('did mount');
    $('#claim-list').dataTable({
      pagingType: 'full_numbers',
      bAutoWidth: false,
      bDestroy: true,
    });
  },

  componentDidUpdate: function() {
    console.log('did update');
    $('#claim-list').dataTable({
      renderer: 'bootstrap',
      bAutoWidth: false,
      bDestroy: true
    });
  }, */

  render: function() {
    var claims = this.state.store.map(function(id) {
      return this.state.claimStore.get(id) || this.state.abbreviatedStore.get(id);
    }, this).filter(function(claim) {
      return this.filters[this.props.filter].indexOf(claim.get('status')) !== -1;
    }, this);

    var wide = $(document).width() >= 800;

    return (
      <Reactable.Table className={"table table-striped "+(wide?"table-wide":"table-narrow")}
                       paginationRenderer={ReactableBootstrapPagination}
                       filtererRenderer={ReactableFilterer}
                       sortable={true}
                       itemsPerPage={3}
                        filterable={this.props.searchEnabled && ['Number', 'Status', 'Name', 'Date', 'otal', 'Submitted', 'Paid']} >
      {_.map(claims.toJS(), function(claim, index) {
        var clicker = this.clickRow.bind(this, claim.id);
        var del = this.clickDelete.bind(this, claim.id, index)
        return (
          <Reactable.Tr key={claim.id}>
          {wide ? <Reactable.Td column="Number" value={claim.number.toString()} handleClick={clicker}>{claim.number.toString()}</Reactable.Td> : undefined}
          <Reactable.Td column="Status" value={claim.status} handleClick={clicker}>{claim.status}</Reactable.Td>
          <Reactable.Td column="Date" value={claim.service_date || ""} handleClick={clicker}>{claim.service_date}</Reactable.Td>
          <Reactable.Td column="Name" value={claim.patient_name || ""} handleClick={clicker}>{claim.patient_name}</Reactable.Td>
          {wide ? <Reactable.Td column="Number" value={claim.patient_number || ""} handleClick={clicker}>{claim.patient_number}</Reactable.Td> : undefined}
          {false ? <Reactable.Td column="Doctor" value={claim.user_id || ""} handleClick={clicker}>{claim.user_id}</Reactable.Td> : undefined}
          <Reactable.Td column="Total" value={claim.total_fee || ""} handleClick={clicker}>{dollars(claim.total_fee)}</Reactable.Td>
          {wide ? <Reactable.Td column="Submitted" value={claim.submitted_fee || ""} handleClick={clicker}>{dollars(claim.submitted_fee)}</Reactable.Td> : undefined}
          {wide ? <Reactable.Td column="Paid" value={claim.paid_fee || ""} handleClick={clicker}>{dollars(claim.paid_fee)}</Reactable.Td> : undefined}
          </Reactable.Tr>
        );
      }, this)}
      </Reactable.Table>
    );

/*    claims = claims.map(function(claim, index) {
      var id = claim.get('id');
      var clicker = this.clickRow.bind(this, id);
      var del = this.clickDelete.bind(this, id, index);

      return (
        <tr key={id}>
          <td onClick={clicker}>{claim.get('number')}</td>
          <td onClick={clicker}>{claim.get('status')}</td>
          <td onClick={clicker}>{claim.get('patient_name')}</td>
          <td onClick={clicker}>{claim.get('service_date')}</td>
          <td onClick={clicker}>{dollars(claim.get('total_fee'))}</td>
          {claim.get('status') === 'saved' && <td><button className="btn btn-danger btn-sm" onClick={del}><Icon i="trash-o" /></button></td>}
        </tr>
      );
    }, this).toJS();
    return (
      <table id='claim-list' className="table table-hover table-striped with-bottom">
        <thead>
          <tr>
            <th>Claim</th>
            <th>Status</th>
            <th>Name</th>
            <th>Date</th>
            <th>Total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {claims}
        </tbody>
      </table>
    ); */
  }
});

