var ClaimList = React.createClass({
  mixins: [ ReactRouter.Navigation ],

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

  render: function() {
    var claims = this.props.store.map(function(claim, index) {
      var id = claim.get('id');
      var clicker = this.clickRow.bind(this, id);
      var del = this.clickDelete.bind(this, id, index);

      return (
        <tr key={id}>
          <td onClick={clicker}>{claim.get('number')}</td>
          <td onClick={clicker}>{claim.get('status')}</td>
          {claim.get('status') === 'saved' && <td><button className="btn btn-danger btn-sm" onClick={del}><Icon i="trash-o" /></button></td>}
        </tr>
      );
    }, this).toJS();
    return (
      <table className="table table-hover table-striped with-bottom">
        <thead>
          <tr>
            <th>Claim</th>
            <th>Status</th>
            <th>Doctor</th>
            <th>Patient</th>
            <th>Patient number</th>
            <th>Service date</th>
            <th>Fee total</th>
            <th>Fee claimed</th>
            <th>Fee receieved</th>
          <th /></tr>
        </thead>
        <tbody>
          {claims}
        </tbody>
      </table>
    );
  }
});

