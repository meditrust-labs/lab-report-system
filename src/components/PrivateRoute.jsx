import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "@Contexts/AuthContext";

function PrivateRoute(props) {
  const { currentUser } = useAuth();
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(newProps) => {
        return currentUser ? <Component {...newProps} /> : <Redirect to="/" />;
      }}
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
};

export default PrivateRoute;
