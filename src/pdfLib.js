import { PDFDocument } from "pdf-lib";

async function generatePDF(formData, candidatePhoto, edit) {
  const formUrl =
    "https://mohdimran001.github.io/lab-report-management-system/public/report.pdf";
  const photoUrl = candidatePhoto;

  // // Fetch the PDF with form fields
  // const formPdfBytes = fetch(formUrl).then((res) => res.arrayBuffer());
  // // Fetch the photo
  // const photoBytes = fetch(photoUrl).then((res) => res.arrayBuffer());

  const [formPdfBytes, photoBytes] = await Promise.all([
    fetch(formUrl).then((res) => res.arrayBuffer()),
    fetch(photoUrl).then((res) => res.arrayBuffer()),
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
    // attach signatue and doctor's name
    const signUrl =
      "https://mohdimran001.github.io/lab-report-management-system/public/sign.jpeg";
    const signBytes = await fetch(signUrl).then((res) => res.arrayBuffer());

    // Embed the sign
    const sign = await pdfDoc.embedJpg(signBytes);
    const signField = form.getButton("signature");
    signField.setImage(sign);

    form.getTextField("dr_name").setText("DR. K.D. GANDHI");
    form.getTextField("dr_degree").setText("MBBS, MD (Micro)");
    form.getTextField("dr_position").setText("(Consultant Pathologist)");
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
