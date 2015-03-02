//= require react-router
//= require ReactRouterBootstrap
//= require react-router-globals
//= require reactable

//= require_tree ./v3

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler {...this.props}/>
    );
  }
});


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

var V3Routes = (
  <Route name="app" path="/" handler={App}>
    <Redirect from="/" to="/claims/drafts" />
    <Route name="claims" path="/claims/:filter" handler={ClaimsPage}/>
    <Route name="profile" handler={Profile}>
      <Route name="settings" handler={ProfileSettings}/>
      <Route name="password" handler={ChangePassword}/>
    </Route>
    <Route name="landing" handler={Landing}/>
    <Route name="new_claim" path="/new_claim" handler={NewClaimPage}/>
    <Route name="claim" path="/claim/:id" handler={ClaimPageSelect}>
      <Route name="claim_patient" path="/claim/:id/patient" handler={PatientTab}/>
      <Route name="claim_claim" path="/claim/:id/claim" handler={ClaimTab}/>
      <Route name="claim_consult" path="/claim/:id/consult" handler={ConsultTab}/>
      <Route name="claim_items" path="/claim/:id/items" handler={ItemsTab}/>
      <Route name="claim_comments" path="/claim/:id/comments" handler={CommentsTab}/>
    </Route>
  </Route>
);

React.initializeTouchEvents(true);

$(document).ready(function() {
  ReactRouter.run(V3Routes, function(Handler, state) {
        React.render(React.createElement(Handler, {params: state.params}), document.body);
  });

  globalActions.startBusy();
  $.ajax({
    url: '/v1/claims',
    dataType: 'json',
    success: function(data) {
      claimListActions.init(data);
      globalActions.endBusy();
    },
    error: function(xhr, status, err) {
      console.error('error loading claims');
      globalActions.endBusy();
    }
  });

});

