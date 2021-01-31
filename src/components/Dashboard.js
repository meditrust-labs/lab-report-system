import { Switch, useRouteMatch, Link } from "react-router-dom";
import { Container } from "react-bootstrap";

import {
  NavigationBar,
  PrivateRoute,
  UpdatePassword,
  FindReport,
  MakeReport,
} from "./index";

function Options() {
  return (
    <Container className="text-center pt-4">
      <h1>
        <img
          alt=""
          src="/meditrust.png"
          className="d-inline-block align-top"
          style={{ marginRight: "1rem", width: "25rem" }}
        />
      </h1>
      <br />
      <br />
      <Link
        to="/dashboard/report"
        className="btn btn-primary px-5"
        style={{ fontSize: "20px" }}
      >
        New Report
      </Link>
      <Link
        to="/dashboard/search"
        className="btn btn-dark  ml-4 px-5"
        style={{ fontSize: "20px" }}
      >
        Find Report
      </Link>
    </Container>
  );
}

function Dashboard() {
  let { path } = useRouteMatch();

  return (
    <>
      <NavigationBar />
      <Switch>
        <PrivateRoute exact path={path} component={Options} />
        <PrivateRoute
          exact
          path={`${path}/change-password`}
          component={UpdatePassword}
        />
        <PrivateRoute exact path={`${path}/report`} component={MakeReport} />
        <PrivateRoute exact path={`${path}/search`} component={FindReport} />
      </Switch>
    </>
  );
}

export default Dashboard;
