import PropTypes from "prop-types";
import { Col, Card } from "react-bootstrap";

function COL(props) {
  const { title, children } = props;
  return (
    <Col>
      <Card>
        <Card.Body>
          <Card.Title>{title}</Card.Title>

          {children}
        </Card.Body>
      </Card>
    </Col>
  );
}

COL.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};

export default COL;
