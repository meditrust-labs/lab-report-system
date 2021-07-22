import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { Formik, Form, Field } from 'formik';

// Layouts
import COL from "../components/Layouts/Col";
import Heading from "../components/Heading";

// Helpers
import ReportsApi from '../services/firebase.service'
import generatePdf from "../utils/pdfLib";
import { REPORT_FIELDS } from '../constants'

// Forms Components
import TextField from "../components/Form/TextField";
import TextFieldWithUnit from "../components/Form/TextFieldWithUnit";
import DateField from "../components/Form/DateField"
import SelectField from "../components/Form/SelectField";
import FileUpload from '../components/Form/FileUpload'
import TextArea from '../components/Form/TextArea'

// Reactive form components
import DisplayPhoto from "../components/Form/ReactiveFields/DisplayPhoto";
import Pregnancy from "../components/Form/ReactiveFields/Pregnancy";
import ExpiryDateField from "../components/Form/ReactiveFields/ExpiryDateField";


function CreateReport() {
  // States related to Modal
  const [data, setData] = useState({
    report: {...REPORT_FIELDS},
    edit: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [show, setShow] = useState(false);
  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  const location = useLocation();
  const history = useHistory();
  
  async function saveAndGenerateReport(formData) {
    setSaving(true);

    try {
      await generatePdf(formData, formData.reportCompleted);

      if (data.report.edit) {
        await ReportsApi.update(data.report.labSrNo, formData);
      } else {
        await ReportsApi.save(data.report, formData);
      }

      setError("");
      setMessage("Report saved successfully");
      showModal();
    } catch (err) {
      console.log(err);
      setMessage("");
      setError(`${err}`);
    }

    setSaving(false);
  }

  async function fetchData() {
      setLoading(true);

      const queryParams = new URLSearchParams(location.search);
      const labSrNo = queryParams.get("edit");
      const editReport = (labSrNo ? true : false);

      const data = ( 
        editReport ? 
        await ReportsApi.getById(labSrNo) : 
        await ReportsApi.getCurrent() 
      );
      
      if (data) {
        const reportData = (
              editReport ? 
              data : { 
                labSrNo: `MT_${data.lab + 1}`,
                refrenceNo: `MT_${data.refrence + 1}`,
                ...REPORT_FIELDS
              }
        ) 
        setData({
          report: reportData,
          edit: editReport,
        });
      } else {
        alert("Report Not Found !, Invalid Lab Sr No.");
        history.push("/dashboard/reports");
      }

      setLoading(false);  
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <Container className="pt-4 text-center">
            <img src="/assets/images/loader.gif" alt="loader"/>
        </Container>
      ) : (
        <Container className="pt-4">
          <Row className="fill-report-icon text-center justify-content-center">
              <img
                src="/assets/images/fill-report.png"
                alt="fill-report-icon"
                style={{ width: "5rem" }}
              />
          </Row>

          <Formik
            initialValues={ 
              data.report
            }
            onSubmit={ async (values, {}) => {
              console.log(values);
              await saveAndGenerateReport(values);
            }}
          >
            <Form>
              <br />
              <br />
              <Row>
                <COL>
                    <TextField name="labSrNo" label="Lab Sr No."  disabled={true}/>
                </COL>
                <COL>
                    <TextField name="refrenceNo" label="Reference No."  disabled={true}/>                    
                </COL>
              </Row>
              <br />
              <br />
              <Heading> Candidate Information </Heading>
              <Row>
                <COL title="Date">
                      <DateField name="dateExamined" label="Examined Date" required/>
                      <ExpiryDateField name="dateExpiry" label="Expiry Date" disabled={true} required/>
                </COL>
                <COL title="Upload Photo">
                  <FileUpload />                
                </COL>
                <COL> 
                  <DisplayPhoto />
                </COL>
              </Row>
              <br />
              <br />
              <Row>
                <COL>
                      <TextField name="fullName" label="Full Name" required/>
                      <TextField name="age" label="Age" required/>
                      <SelectField name="gender" label="Gender" required>
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </SelectField>
                      <TextFieldWithUnit name="height" label="Height" unit="cm" />
                </COL>
                <COL>
                      <TextFieldWithUnit name="weight" label="Weight" unit="kg" />
                      <SelectField name="maritalStatus" label="Marital Status" required>
                          <option value="">-- Select --</option>
                          <option value="Married"> Married </option>
                          <option value="Unmarried"> Unmarried </option>
                      </SelectField>
                      <DateField name="dob" label="Date of Birth" required/>
                      <DateField name="doi" label="Date of Issue" required/>
                </COL>
                <COL>
                    <TextField name="poi" label="Place of Issue" required/>
                    <TextField name="nationality" label="Nationality" required/>
                    <TextField name="passport" label="Passport No." required/>
                    <TextField name="post" label="Post applied for." required/>
                </COL>
              </Row>

              {/* Medical Examination Form */}
              <br />
              <Heading>Medical examination</Heading>
              <Row>
                <COL title="EYES">
                      <SelectField name="visionRightEye" label="Vision Right Eye">
                          <option value="">-- Select --</option>
                          <option value="6/6">6/6</option>
                          <option value="6/9">6/9</option>
                          <option value="6/18">6/18</option>
                      </SelectField>
                      <TextField name="otherRightEye" label="Other Right Eye" />
                      <SelectField name="visionLeftEye" label="Vision Left Eye">
                          <option value="">-- Select --</option>
                          <option value="6/6">6/6</option>
                          <option value="6/9">6/9</option>
                          <option value="6/18">6/18</option>
                      </SelectField>
                      <TextField name="otherLeftEye" label="Other Left Eye" />
                </COL>
                <COL title="EARS">
                      <TextField name="rightEar" label="Right Ear" />
                      <TextField name="leftEar" label="Left Ear" />
                </COL>
                <COL title="SYSTEMATIC EXAM">
                      <TextFieldWithUnit name="bloodPressure" label="Blood Pressure" unit="mm Hg" />
                      <TextField name="heart" label="Heart" />
                      <TextField name="lungs" label="Lungs" />
                      <TextField name="abdomen" label="Abdomen" />
                </COL>
              </Row>
              <br />
              <Row>
                <COL title="VENEREAL DISEASES (CLINICAL)">
                      <SelectField name="VDRLorTPHA" label="VDRL/TPHA">
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                      </SelectField>
                </COL>
                <COL title="CHEST X-RAY">
                      <TextField name="chest" label="" />
                </COL>
                <COL title="PREGNANCY">
                      <Pregnancy />
                </COL>
              </Row>
              {/* Medical Examination Form */}
              <br />

              {/* LAB INVESTIGATION Form */}
              <br />
              <Heading>LAB INVESTIGATION</Heading>
              <Row>
                <COL title="URINE">
                      <TextField name="sugar" label="Sugar" />
                      <TextField name="albumin" label="Albumin" />
                      <TextField name="urineBilharziasis" label="Bilharziasis" />
                      <TextField name="urineOthers" label="Others" />
                </COL>
                <COL title="BLOOD">
                      <TextFieldWithUnit name="hemoglobin" label="Hemoglobin" unit="gm %" />
                      <TextField name="malariaFilm" label="Malaria Film" />
                      <SelectField name="microFilaria" label="Micro Filaria">
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                      </SelectField>
                      <SelectField name="bloodGroup" label="Blood Group">
                          <option value="">-- Select --</option>
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="O+">O+</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O-">O-</option>
                          <option value="B-">B-</option>
                          <option value="A-">A-</option>
                      </SelectField>
                      <TextField name="bloodOthers" label="Others" />
                </COL>
                <COL title="STOOL">
                      <TextField name="helminths" label="Helminths" />
                      <TextField name="stoolBilharziasis" label="Bilharziasis" />
                      <TextField name="salmonellaShigella" label="Salmonella/Shigella" />
                      <TextField name="cholera" label="V. Cholera" />
                </COL>
              </Row>
              <br />
              <Row>
                <COL title="SEROLOGY">
                      <SelectField name="hiv" label="HIV">
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                      </SelectField>
                      <SelectField name="hsabg" label="HBsAg">
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                      </SelectField>
                      <SelectField name="antiHCV" label="Anti HCV">
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                      </SelectField>
                      <TextField name="lft" label="L.F.T" />
                </COL>
                <COL title="SEROLOGY">
                      <TextFieldWithUnit name="urea" label="Urea" unit="mg/dl" />
                      <TextFieldWithUnit name="creatinine" label="Creatinine" unit="mg/dl" />
                      <TextFieldWithUnit name="bloodSugar" label="Blood Sugar" unit="mg/dl" />
                      <TextField name="kft" label="K.F.T" />
                </COL>
                <COL title="COVID">
                      <SelectField name="covid" label="Covid">
                          <option value="">-- Select --</option>
                          <option value="Positive"> Positive </option>
                          <option value="Negative"> Negative </option>                      
                      </SelectField>
                </COL>
              </Row>
              {/* LAB INVESTIGATION Form */}

              <br />
              <br />
              <Row>
                <COL title="Remarks">
                      <SelectField name="fit" label="Fit or Unfit">
                          <option value="">-- Select --</option>
                          <option value="FIT"> FIT </option>
                          <option value="UNFIT"> UNFIT </option>                      
                      </SelectField>
                      <TextArea name="remarks" label="Remarks:-"/>
                      <Field name="reportCompleted" className="" style={{width: '25px'}} type="checkbox"/>
                      <p>
                        Tick this to print final report.
                      </p>
                </COL>
                <COL>
                  <div>
                    {error.length > 0 && <Alert variant="danger">{error}</Alert>}
                  </div>
                </COL>
              </Row>

              <br />
              <br />
              <Button
                disabled={saving}
                type="submit"
                className="px-4 py-2"
                style={{ fontSize: "1.2rem", letterSpacing: "2px" }}
              >
                GENERATE REPORT
              </Button>
              {saving && <img src="/assets/images/loader.gif" alt="loader" className="ml-4" />}
            </Form>
          </Formik>
          <br />
          <br />
          <br />
        </Container>
      )}

      <Modal show={show} onHide={closeModal} backdrop="static" keyboard={false}>
        <Modal.Body>
          {message.length > 0 && <Alert variant="success">{message}</Alert>}
          <Button
            variant="primary"
            onClick={() => {
              history.push("/dashboard");
              closeModal();
            }}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateReport;
