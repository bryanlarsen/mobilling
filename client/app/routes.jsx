import { Route } from 'react-router';

import Root from './components/Root';
import LoginPage from './components/LoginPage';
import ClaimsPage from './components/ClaimsPage';
import ProfilePage from './components/ProfilePage';
import ProfileSettings from './components/ProfileSettings';
import ClaimPageSelect from './components/ClaimPageSelect';
import ClaimPatient from './components/ClaimPatient';
import ClaimTab from './components/ClaimTab';
import ConsultTab from './components/ConsultTab';
import ItemsTab from './components/ItemsTab';
import NewClaimPage from './components/NewClaimPage';
import NewUserPage from './components/NewUserPage';
import CommentsTab from './components/CommentsTab';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ChangePassword from './components/ChangePassword';

const routes = (
  <Route path="/" component={Root}>
    <Route name="claims" path="/claims" component={ClaimsPage}/>
    <Route path="profile" component={ProfilePage}>
      <Route path="settings" component={ProfileSettings} />
      <Route path="password" component={ChangePassword} />
    </Route>
    <Route path="claim/new" component={NewClaimPage} />
    <Route path="claim/:id" component={ClaimPageSelect} >
      <Route path="patient" component={ClaimPatient} />
      <Route path="claim" component={ClaimTab} />
      <Route path="consult" component={ConsultTab} />
      <Route path="codes" component={ItemsTab} />
      <Route path="comments" component={CommentsTab} />
    </Route>
    <Route path="login" component={LoginPage} />
    <Route path="forgot_password" component={ForgotPasswordPage} />
    <Route path="create_account" component={NewUserPage} />
  </Route>
);

export default routes;
