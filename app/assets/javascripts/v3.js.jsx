//= require react-router
//= require react-router-bootstrap
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
    <Route name="login" path="/login" handler={LoginPage} />
    <Route name="forgot_password" path="/forgot_password" handler={ForgotPasswordPage} />
    <Route name="create_account" path="/create_account" handler={NewUserPage} />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

React.initializeTouchEvents(true);

$(document).ready(function() {
  FastClick.attach(document.body);

  globalActions.setRouter(ReactRouter.run(V3Routes, ReactRouter.HistoryLocation, function(Handler, state) {
        React.render(React.createElement(Handler, {params: state.params}), document.body);
  }));

  if (["/login", "/forgot_password", "/create_account"].indexOf(globalStore().get('router').getCurrentPath()) === -1) {
    globalActions.init();
  }

});

