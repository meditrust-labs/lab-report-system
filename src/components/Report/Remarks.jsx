import { Row, Alert, Col } from "react-bootstrap";
import { Field } from "formik";
import PropTypes from "prop-types";

import { TextArea, SelectField } from "@Form";

import COL from "@Components/Layouts/Col";

function Remarks(props) {
  const { error } = props;
  return (
    <Row>
      <COL title="Remarks">
        <SelectField name="fit" label="Fit or Unfit">
          <option value="">-- Select --</option>
          <option value="FIT"> FIT </option>
          <option value="UNFIT"> UNFIT </option>
          <option value="PENDING"> PENDING </option>
        </SelectField>
        <TextArea name="remarks" label="Remarks:-" />
        <Field
          name="reportCompleted"
          className=""
          style={{ width: "25px" }}
          type="checkbox"
        />
        <p>Tick this to print final report.</p>
      </COL>
      <Col>
        <div>{error.length > 0 && <Alert variant="danger">{error}</Alert>}</div>
      </Col>
    </Row>
  );
}

Remarks.propTypes = {
  error: PropTypes.string.isRequired,
};

export default Remarks;
