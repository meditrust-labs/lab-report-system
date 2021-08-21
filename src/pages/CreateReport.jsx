import React, { useState, useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import toast from "react-hot-toast";

// Report Components
import {
  SerialNoFields,
  CandidateInfoFields,
  MedicalExaminationFields,
  LabInvestigationFields,
  Remarks,
} from "@Components/Report";

// Firebase Service
import ReportsApi from "@Services/firebase.service";

// Helpers
import GeneratePDF from "@Helpers/pdf.helper";
import { formatSavingData } from "@Helpers/data.helper";

// Constants
import { REPORT_FIELDS } from "../constants";

function CreateReport() {
  // States related to Modal
  const [data, setData] = useState({
    report: { ...REPORT_FIELDS },
    edit: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const history = useHistory();

  async function saveAndGenerateReport(formData) {
    setSaving(true);
    const id = toast.loading("Saving report ...");

    const formattedFormData = formatSavingData(formData);
    try {
      await GeneratePDF(formattedFormData, formData.reportCompleted);

      if (data.edit) {
        await ReportsApi.update(formattedFormData);
      } else {
        await ReportsApi.save(formattedFormData);
      }

      toast.success("Report saved successfully", { id });
      setError("");
      history.push("/dashboard/reports");
    } catch (err) {
      toast.error("An error occurred while saving report, please try again", {
        id,
      });
      console.log(err);
      setError(`${err}`);
    }

    setSaving(false);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const queryParams = new URLSearchParams(location.search);
      const labSrNo = queryParams.get("edit");
      const editReport = !!labSrNo;

      const toastId = editReport
        ? toast.loading("loading report data ...")
        : toast.loading("creating an empty report ...");

      const fetchedData = editReport
        ? await ReportsApi.getById(labSrNo)
        : await ReportsApi.getCurrent();

      if (fetchedData) {
        const reportData = editReport
          ? fetchedData
          : {
              id: fetchedData.id,
              lab: fetchedData.lab,
              refrence: fetchedData.refrence,
              labSrNo: `MT_${fetchedData.lab + 1}`,
              refrenceNo: `MT_${fetchedData.refrence + 1}`,
              ...REPORT_FIELDS,
            };
        if (editReport)
          toast.success("Now you can edit the report", { id: toastId });
        else toast.success("Go Ahead ! report is ready.", { id: toastId });

        setData({
          report: reportData,
          edit: editReport,
        });
      } else {
        toast.error("No report found with this serial no.", { id: toastId });
        history.push("/dashboard/reports");
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <Container className="pt-4 text-center">
          <img src="/assets/images/loader.gif" alt="loader" />
        </Container>
      ) : (
        <Container
          style={{
            marginBottom: "5rem",
          }}
          className="pt-4"
        >
          <Row className="fill-report-icon text-center justify-content-center">
            <img
              src="/assets/images/fill-report.png"
              alt="fill-report-icon"
              style={{ width: "5rem" }}
            />
          </Row>

          <Formik
            initialValues={data.report}
            onSubmit={async (values) => {
              await saveAndGenerateReport(values);
            }}
          >
            <Form>
              <br />
              <SerialNoFields />
              <br />
              <CandidateInfoFields />
              <br />
              <MedicalExaminationFields />
              <br />
              <LabInvestigationFields />
              <br />
              <Remarks error={error} />
              <br />
              <Button
                disabled={saving}
                type="submit"
                className="px-4 py-2"
                style={{
                  fontSize: "1.2rem",
                  letterSpacing: "2px",
                  fontFamily: "Ubuntu, sans-serif",
                  marginTop: "2rem",
                }}
              >
                GENERATE REPORT
              </Button>
            </Form>
          </Formik>
        </Container>
      )}
    </>
  );
}

export default CreateReport;
