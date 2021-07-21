import { useField } from "formik";
import { Form } from 'react-bootstrap';

const CheckBox = ({label, ...props}) => {
    return (
    const [field, meta] = useField(props);

    return (
        <Form.Group>
            <FormCheck>
                <FormCheck.Input  type="checkbox" />
                <FormCheck.Label> {label} </FormCheck.Label>
                <Feedback type="invalid">Yo this is required</Feedback>
            </FormCheck>


            {meta.touched && meta.error ? (
                <Form.Text  style={{color: 'red'}}> {meta.error} </Form.Text>
            ) : null }
        </Form.Group>
    )

    )
}

export default CheckBox;