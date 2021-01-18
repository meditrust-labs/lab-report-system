import { BrowserRouter as Router, Switch } from "react-router-dom";

import { NavigationBar, PrivateRoute, UpdatePassword } from "./index";

function Dashboard() {
  return (
    <>
      <NavigationBar />
      {/* <Router>
        <Switch>
          <PrivateRoute path="/change-password" component={UpdatePassword} />
        </Switch>
      </Router> */}
    </>
  );
}

export default Dashboard;
