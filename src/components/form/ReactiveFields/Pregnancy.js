import { useEffect } from "react";
import { useFormikContext } from "formik";

import TextField from "../TextField";

const Pregnancy = () => {
    const { 
        values: {
            gender
        },
        setFieldValue
    } = useFormikContext();


    useEffect(() => {
        if (gender === "FEMALE") {
            setFieldValue('pregnancy', 'APPLICABLE')
        } else if (gender === "MALE") {
            setFieldValue('pregnancy', 'NOT APPLICABLE')
        }
    }, [gender, setFieldValue])

    return (
        <TextField name="pregnancy" label="" />
    )
}

export default Pregnancy;