import { convertDate } from "./date.helper";

export const formatSavingData = (values) => {
    values[dateExamined] = convertDate(values[dateExamined]);
    values[dateExpiry] = convertDate(values[dateExpiry]);
    values[dob] = convertDate(values[dob]);
    values[doi] = convertDate(values[doi]);

    values[fullName] = values[fullName].toUpperCase();

    const h = values[height];
    const w = values[weight];
    values[height] = h.length > 0 ? (h + " cm") : "",
    values[weight] = w.length > 0 ? (w + " kg") : "",

    values[passport] = values[passport].toUpperCase();
}

export const formatFetchedData = (values) => {

}

export const getNumericData = (value) => {
    return value.split(" ")[0];
}