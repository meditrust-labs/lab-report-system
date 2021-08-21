import { Switch, useRouteMatch } from "react-router-dom";

import { PrivateRoute, QuickAccessButtons } from "@Components/";

import AppLayout from "@Components/Layouts/AppLayout";
import UpdatePassword from "@Pages/UpdatePassword";
import CreateReport from "@Pages/CreateReport";
import Reports from "@Pages/Reports";

function Dashboard() {
  const { path } = useRouteMatch();

  return (
    <AppLayout>
      <Switch>
        <PrivateRoute exact path={path} component={QuickAccessButtons} />
        <PrivateRoute
          exact
          path={`${path}/change-password`}
          component={UpdatePassword}
        />
        <PrivateRoute
          exact
          path={`${path}/create-report`}
          component={CreateReport}
        />
        <PrivateRoute exact path={`${path}/reports`} component={Reports} />
      </Switch>
    </AppLayout>
  );
}

export default Dashboard;
