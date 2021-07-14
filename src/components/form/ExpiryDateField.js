import { useField, useFormikContext } from "formik";
import { useEffect } from "react";
import { Form } from 'react-bootstrap';

import { getExpiryDate } from "../../utils/date.helper";

const ExpiryDateField = ({ label, ...props }) => {
    const { 
        values: { 
            dateExamined
        },
        touched,
        setFieldValue
    } = useFormikContext();

    const [field, meta] = useField(props);

    useEffect(() => {
        if (touched.dateExamined && dateExamined.length > 0) {
            setFieldValue(props.name, getExpiryDate(dateExamined));
        }
    }, [dateExamined, touched.dateExamined, setFieldValue, props.name])

    return (
        <Form.Group>
            <Form.Label htmlFor={props.id || props.name}  > 
                {label} 
            </Form.Label>

            <Form.Control type="date" {...field} {...props} />

            {meta.touched && meta.error ? (
                <Form.Text style={{color: 'red'}}> {meta.error} </Form.Text>
            ) : null }
        </Form.Group>
    )
}

export default ExpiryDateField;