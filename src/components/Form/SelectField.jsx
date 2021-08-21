import { useField } from "formik";

import { Form } from "react-bootstrap";

const SelectField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Group id={props.name}>
      <Form.Label htmlFor={props.id || props.name}>{label}</Form.Label>
      <Form.Control as="select" custom {...field} {...props} />
      {meta.touched && meta.error ? (
        <Form.Text style={{ color: "red" }}> {meta.error} </Form.Text>
      ) : null}
    </Form.Group>
  );
};

export default SelectField;
