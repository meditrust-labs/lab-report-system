import { Switch, useRouteMatch } from "react-router-dom";

import {
  PrivateRoute,
  Layout,
  QuickAccessButtons
} from "../components/index";

import UpdatePassword from './UpdatePassword'
import CreateReport from './CreateReport'
import Reports from './Reports'


function Dashboard() {
  let { path } = useRouteMatch();

  return (
    <Layout>
      <Switch>
        <PrivateRoute exact path={path} component={QuickAccessButtons} />
        <PrivateRoute
          exact
          path={`${path}/change-password`}
          component={UpdatePassword}
        />
        <PrivateRoute exact path={`${path}/create-report`} component={CreateReport} />
        <PrivateRoute exact path={`${path}/reports`} component={Reports} />
      </Switch>
    </Layout>
  );
}

export default Dashboard;
