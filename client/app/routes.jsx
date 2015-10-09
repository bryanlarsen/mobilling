import { Route } from 'react-router';

import { Root, LoginPage } from "./components";

const routes = (
  <Route path="/" component={Root}>
    <Route path="login" component={LoginPage} />
  </Route>
);

export default routes;
