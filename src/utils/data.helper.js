import { convertDate } from "./date.helper";

const getNumericData = (value) => {
    return value.split(" ")[0];
}

export const formatSavingData = (values) => {
    const newValues = { ...values };

    newValues['dateExamined'] = convertDate(newValues['dateExamined']);
    newValues['dateExpiry'] = convertDate(newValues['dateExpiry']);
    newValues['dob'] = convertDate(newValues['dob']);
    newValues['doi'] = convertDate(newValues['doi']);

    newValues['fullName'] = newValues['fullName'].toUpperCase();
    newValues['passport'] = newValues['passport'].toUpperCase();

    const h = newValues['height'];
    const w = newValues['weight'];
    newValues['height'] = h.length > 0 ? (h + " cm") : "";
    newValues['weight'] = w.length > 0 ? (w + " kg") : "";

    newValues['bloodPressure'] = newValues['bloodPressure'] + " mm Hg";
    newValues['hemoglobin'] = newValues['hemoglobin'] + " gm %";
    newValues['urea'] = newValues['urea'] + " mg/dl";
    newValues['creatinine'] = newValues['creatinine'] + " mg/dl";
    newValues['bloodSugar'] = newValues['bloodSugar'] + " mg/dl";

    return newValues;
}

export const formatFetchedData = (values) => {
    values['dateExamined'] = convertDate(values['dateExamined']);
    values['dateExpiry'] = convertDate(values['dateExpiry']);
    values['dob'] = convertDate(values['dob']);
    values['doi'] = convertDate(values['doi']);
    
    values["weight"] = getNumericData(values["weight"]);
    values["height"] = getNumericData(values["height"]);
    values["urea"] = getNumericData(values["urea"]);
    values["creatinine"] = getNumericData(values["creatinine"]);
    values["hemoglobin"] = getNumericData(values["hemoglobin"]);
    values["bloodPressure"] = getNumericData(values["bloodPressure"]);
    values["bloodSugar"] = getNumericData(values["bloodSugar"]);

    return values;
}

