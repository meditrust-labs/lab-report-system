import { useField } from "formik";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const TextArea = (props) => {
  const { label, name, id } = props;

  const [field, meta] = useField(props);

  return (
    <Form.Group>
      <Form.Label htmlFor={id || name}>{label}</Form.Label>

      <Form.Control type="textarea" rows={2} {...field} {...props} />

      {meta.touched && meta.error ? (
        <Form.Text style={{ color: "red" }}> {meta.error} </Form.Text>
      ) : null}
    </Form.Group>
  );
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default TextArea;
