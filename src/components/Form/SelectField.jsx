import { useField } from "formik";
import PropTypes from "prop-types";

import { Form } from "react-bootstrap";

const SelectField = (props) => {
  const { label, name, id } = props;

  const [field, meta] = useField(props);

  return (
    <Form.Group id={name}>
      <Form.Label htmlFor={id || name}>{label}</Form.Label>
      <Form.Control as="select" custom {...field} {...props} />
      {meta.touched && meta.error ? (
        <Form.Text style={{ color: "red" }}> {meta.error} </Form.Text>
      ) : null}
    </Form.Group>
  );
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default SelectField;
