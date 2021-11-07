import { useEffect } from "react";
import { useFormikContext } from "formik";
import { parse, differenceInYears } from "date-fns";

import { customParse } from "@Helpers/date.helper";
import TextField from "@Components/Form/TextField";

const Age = () => {
  const {
    values: { dob },
    touched,
    setFieldValue,
  } = useFormikContext();

  useEffect(() => {
    const d = customParse(dob);
    const dateOfBirth = parse(d, "dd/MM/yyyy", new Date());
    const age = differenceInYears(new Date(), dateOfBirth);
    setFieldValue("age", age.toString());
  }, [dob, setFieldValue, touched.dob]);

  return <TextField name="age" label="Age" />;
};

export default Age;
