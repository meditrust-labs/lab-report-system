import { useField } from "formik";
import { Form } from 'react-bootstrap';

const TextField = ({label, unit, ...props}) => {
    const [field, meta] = useField(props);

    return (
        <Form.Group>
            <Form.Label htmlFor={props.id || props.name}  > 
                {label} ({unit})
            </Form.Label>

            <Form.Control 
                type="text" 
                {...field} 
                {...props} 
                style={{ display: "inline" }}
            />
            <span style={{ marginLeft: "-4rem" }}>{unit}</span>

            {meta.touched && meta.error ? (
                <Form.Text  style={{color: 'red'}}> {meta.error} </Form.Text>
            ) : null }
        </Form.Group>
    )
}

export default TextField;