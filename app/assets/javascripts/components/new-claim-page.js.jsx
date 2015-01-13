// HACK: the act of visiting this page (actually componentWillMount) will trigger the 'newClaim' action
// this isn't the 'right' way of doing this, but it's expedient

var NewClaimPage = React.createClass({
  mixins: [ ReactRouter.Navigation ],

  componentWillMount: function() {
    var page = this;
    claimActions.newClaim({callback: function(id) {
      page.transitionTo('claim_patient', {id: id});
    }});
  },

  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <h1><i className="fa fa-cog fa-spin" /> New Claim</h1>
        </div>
      </div>
    );
  }
});
