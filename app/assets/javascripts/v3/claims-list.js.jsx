var ClaimList = React.createClass({
  render: function() {
    var claims = this.props.store.map(function(claim) {
      console.log('id', claim.get('id'));
      return (
        <Link key={"claim-"+claim.get('id')} to="claim_patient" params={{id: claim.get('id')}}><li className="list-group-item">Claim {claim.get('number')} {claim.get('status')}</li></Link>
      );
    }).toJS();
    return (
      <ul className="list-group with-bottom">
        {claims}
      </ul>
    );
  }
});

