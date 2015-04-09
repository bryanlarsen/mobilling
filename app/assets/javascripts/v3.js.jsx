//= require react-router
//= require ReactRouterBootstrap
//= require react-router-globals

//= require_tree ./v3

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler {...this.props}/>
    );
  }
});


var V3Routes = (
  <Route name="app" path="/" handler={App}>
    <Redirect from="/" to="/claims?filter=drafts&sort=-number" />
    <Route name="claims" path="/claims" handler={ClaimsPage}/>
    <Route name="profile" handler={Profile}>
      <Route name="settings" handler={ProfileSettings}/>
      <Route name="password" handler={ChangePassword}/>
    </Route>
    <Route name="new_claim" path="/new_claim" handler={NewClaimPage}/>
    <Route name="claim" path="/claim/:id" handler={ClaimPageSelect}>
      <Route name="claim_patient" path="patient" handler={PatientTab}/>
      <Route name="claim_claim" path="claim" handler={ClaimTab}/>
      <Route name="claim_consult" path="consult" handler={ConsultTab}/>
      <Route name="claim_items" path="items" handler={ItemsTab}/>
      <Route name="claim_comments" path="comments" handler={CommentsTab}/>
    </Route>
  </Route>
);

React.initializeTouchEvents(true);

$(document).ready(function() {
  FastClick.attach(document.body);

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

