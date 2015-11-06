const { Route } = require('react-router');

import { Root, LoginPage, ClaimsPage, ProfilePage, ProfileSettings, ClaimPageSelect, ClaimPatient, ClaimTab, ConsultTab, ItemsTab, NewClaimPage, NewUserPage, CommentsTab, ForgotPasswordPage } from "./components";

const routes = (
  <Route path="/" component={Root}>
    <Route name="claims" path="/claims" component={ClaimsPage}/>
    <Route path="login" component={LoginPage} />
    <Route path="profile" component={ProfilePage}>
      <Route path="settings" component={ProfileSettings} />
    </Route>
    <Route path="claim/new" component={NewClaimPage} />
    <Route path="claim/:id" component={ClaimPageSelect} >
      <Route path="patient" component={ClaimPatient} />
      <Route path="claim" component={ClaimTab} />
      <Route path="consult" component={ConsultTab} />
      <Route path="items" component={ItemsTab} />
      <Route path="comments" component={CommentsTab} />
    </Route>
    <Route path="/create_account" component={NewUserPage} />
    <Route path="/forgot_password" component={ForgotPasswordPage} />
  </Route>
);

module.exports = routes;
