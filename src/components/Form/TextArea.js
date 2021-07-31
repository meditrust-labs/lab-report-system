import { useField } from "formik";
import { Form } from 'react-bootstrap';

const TextArea = ({label, ...props}) => {
    const [field, meta] = useField(props);

    return (
        <Form.Group>
            <Form.Label htmlFor={props.id || props.name}  > 
                {label} 
            </Form.Label>

            <Form.Control type="textarea" rows={2} {...field} {...props} />

            {meta.touched && meta.error ? (
                <Form.Text  style={{color: 'red'}}> {meta.error} </Form.Text>
            ) : null }
        </Form.Group>
    )
}

export default TextArea;