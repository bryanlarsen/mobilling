

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler {...this.props}/>
    );
  }
});

var V3Routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="claims" path="/claims/:filter" handler={ClaimsPage}/>
    <Route name="profile" handler={Profile}/>
    <Route name="landing" handler={Landing}/>
    <Route name="signout" handler={Landing}/>
    <Route name="new_claim" path="/new_claim" handler={NewClaimPage}/>
    <Route name="claim" path="/claim/:id" handler={ClaimPage}>
      <Route name="claim_patient" path="/claim/:id/patient" handler={PatientTab}/>
      <Route name="claim_claim" path="/claim/:id/claim" handler={ClaimTab}/>
      <Route name="claim_consult" path="/claim/:id/consult" handler={ConsultTab}/>
      <Route name="claim_items" path="/claim/:id/items" handler={ItemsTab}/>
      <Route name="claim_comments" path="/claim/:id/comments" handler={CommentsTab}/>
    </Route>
  </Route>
);

var Landing = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="page-header">
          <h1>Mo-Billing</h1>
        </div>
      </div>
    );
  }
});



