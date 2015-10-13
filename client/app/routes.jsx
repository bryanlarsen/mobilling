import { Route } from 'react-router';

import { Root, LoginPage, ClaimsPage, ProfilePage, ProfileSettings, ClaimPageSelect, ClaimPatient, ClaimTab, ConsultTab, ItemsTab } from "./components";

const routes = (
  <Route path="/" component={Root}>
    <Route name="claims" path="/claims" component={ClaimsPage}/>
    <Route path="login" component={LoginPage} />
    <Route path="profile" component={ProfilePage}>
      <Route path="settings" component={ProfileSettings} />
    </Route>
    <Route path="claim/:id" component={ClaimPageSelect} >
      <Route path="patient" component={ClaimPatient} />
      <Route path="claim" component={ClaimTab} />
      <Route path="consult" component={ConsultTab} />
      <Route path="items" component={ItemsTab} />
    </Route>
  </Route>
);

export default routes;
