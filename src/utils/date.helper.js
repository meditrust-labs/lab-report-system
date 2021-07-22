import { parse, add, format, sub } from "date-fns";

export const getExpiryDate = (date) => {
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());

    let expiryDate = add(parsedDate, { months: 3 });
    expiryDate = sub(expiryDate, { days: 1 });
    expiryDate = format(expiryDate, "yyyy-MM-dd");
    return expiryDate
}

export const convertDate = (value) => {
    let date = value.split("-");
    let temp = date[0];
    date[0] = date[2];
    date[2] = temp;
    date = date.join("-");
    return date;
}

export const getNumericData = (value) => {
    return value.split(" ")[0];
}