import { PDFDocument } from "pdf-lib";

async function generatePDF(formData, candidatePhoto, checkBoxes) {
  try {
    // Fetch the PDF with form fields
    const formUrl =
      "https://mohdimran001.github.io/lab-report-management-system/public/report.pdf";
    const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

    // Fetch the photo
    const photoUrl = candidatePhoto;
    const photoBytes = await fetch(photoUrl).then((res) => res.arrayBuffer());

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

    // set checkboxes
    const fitField = form.getTextField("fit");
    const covidField = form.getTextField("covid");

    const fitValue = checkBoxes["fit"] ? "FIT" : "UNFIT";
    fitField.setText(fitValue);

    const covidValue = checkBoxes["covid"] ? "Positive" : "Negative";
    covidField.setText(covidValue);

    form.flatten();

    const pdfBytes = await pdfDoc.save();

    require("downloadjs")(
      pdfBytes,
      `Report-${formData["labSrNo"]}.pdf`,
      "application/pdf"
    );
  } catch (err) {
    console.log(err);
  }

  return;
}

export default generatePDF;
