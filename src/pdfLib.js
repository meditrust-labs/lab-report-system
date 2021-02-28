import { PDFDocument } from "pdf-lib";

import { BASE_URL, CACHE_NAME } from "./config";

async function fetchAndCacheData(url) {
  let cache;
  return caches
    .open(CACHE_NAME)
    .then((cacheStorage) => {
      cache = cacheStorage;
      return cacheStorage.add(url);
    })
    .then((someReponse) => {
      return cache.match(url);
    })
    .then((cachedResponse) => cachedResponse);
}

async function fetchCachedData(url) {
  return caches
    .open(CACHE_NAME)
    .then((cacheStorage) => {
      return cacheStorage.match(url);
    })
    .then((cachedResponse) => {
      if (!cachedResponse || !cachedResponse.ok) {
        console.log("fetch and save data");
        return fetchAndCacheData(url);
      }
      return cachedResponse;
    })
    .catch((err) => console.log(err));
}

async function generatePDF(formData, candidatePhoto, edit) {
  const formUrl = edit
    ? BASE_URL + "/edit-report.pdf"
    : BASE_URL + "/report.pdf";
  // const signUrl = BASE_URL + "/sign.jpeg";
  const stampUrl = BASE_URL + "/stamp.png";
  const photoUrl = candidatePhoto;

  console.log(formUrl);

  const [formPdfBytes, photoBytes, stampBytes] = await Promise.all([
    fetchCachedData(formUrl).then((res) => res.arrayBuffer()),
    fetch(photoUrl).then((res) => res.arrayBuffer()),
    fetchCachedData(stampUrl).then((res) => res.arrayBuffer()),
    // fetchCachedData(signUrl).then((res) => res.arrayBuffer()),
  ]);

  // Load a PDF with form fields
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  // Embed the photo
  const photo = await pdfDoc.embedJpg(photoBytes);

  // Get the form containing all the fields
  const form = pdfDoc.getForm();

  // set text fields
  Object.keys(formData).map((key, index) => {
    const value = formData[key];
    const field = form.getTextField(key);
    field.setText(value);
    return index;
  });

  // set candidate photo
  const photoField = form.getButton("photo");
  photoField.setImage(photo);

  if (edit) {
    // Embed the sign
    // const sign = await pdfDoc.embedJpg(signBytes);
    // const signField = form.getButton("signature");
    // signField.setImage(sign);

    // Embed the stamp
    const stamp = await pdfDoc.embedPng(stampBytes);
    const stampField = form.getButton("stamp");
    stampField.setImage(stamp);

    // form.getTextField("dr_name").setText("DR. K.D. GANDHI");
    // form.getTextField("dr_degree").setText("MBBS, MD (Micro)");
    // form.getTextField("dr_position").setText("(Consultant Pathologist)");
  }

  form.flatten();

  const pdfBytes = await pdfDoc.save();

  require("downloadjs")(
    pdfBytes,
    `Report-${formData["labSrNo"]}.pdf`,
    "application/pdf"
  );

  return;
}

export default generatePDF;
