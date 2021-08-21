import PropTypes from "prop-types";

import { NavigationBar } from "@Components/";

function AppLayout(props) {
  const { children } = props;

  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}

AppLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AppLayout;
