import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";
import toast from "react-hot-toast";

import ReportsApi from "@Services/firebase.service";
import GeneratePDF from "@Helpers/pdf.helper";

import { useAuth } from "@Contexts/AuthContext";

const DownloadReportFromUrl = () => {
  const [msg, setMsg] = useState("");
  const { serialNo, token } = useParams();

  const { anonymousSignIn } = useAuth();

  const downloadReport = async (report) => {
    setMsg("Downloading Report...");
    const toastId = toast.loading("generating report...");

    try {
      await GeneratePDF(report, true);
      toast.success("Report Generated Successfully", { id: toastId });
    } catch (err) {
      console.log(err);
      toast.error(err.message, { id: toastId });
    }

    setMsg("Report has been downloaded!");
  };

  useEffect(() => {
    async function verifyReport() {
      let report = null;
      try {
        await anonymousSignIn();
        report = await ReportsApi.getById(serialNo);
        if (report && report.token === token) {
          await downloadReport(report);
        } else {
          setMsg("Couldn't find report, please contact the lab");
        }
      } catch (err) {
        console.log(err);
        setMsg(
          "An unexpected error occured, please try again in a few moments"
        );
      }
    }

    verifyReport();
  }, []);

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ textAlign: "center", marginTop: "10rem" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {msg.length > 0 && <Alert variant="primary">{msg}</Alert>}
        <a href="https://mohdimran.vercel.app">
          This project is developed by Mohammad Imran.
        </a>
      </div>
    </Container>
  );
};

export default DownloadReportFromUrl;
