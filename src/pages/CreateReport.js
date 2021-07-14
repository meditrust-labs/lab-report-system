import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";
import { Formik, Form } from 'formik';

// Layouts
import Col from "../components/Layouts/Col";
import Heading from "../components/Heading";

// Helpers
import ReportsApi from '../services/firebase.service'
import generatePdf from "../utils/pdfLib";
import { REPORT_FIELDS } from '../constants'

// Forms Components
import TextField from "../components/form/TextField";
import TextFieldWithUnit from "../components/form/TextFieldWithUnit";
import DateField from "../components/form/DateField"
import ExpiryDateField from "../components/form/ExpiryDateField";

// Reactive form components
import FileUpload from '../components/form/FileUpload'
import DisplayPhoto from "../components/form/ReactiveFields/DisplayPhoto";
import Pregnancy from "../components/form/ReactiveFields/Pregnancy";

function CreateReport() {
  // States related to Modal
  const [report, setReport] = useState({});
  const [show, setShow] = useState(false);
  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  const history = useHistory();
  async function generateReport(flag) {
    setLoading(true);
    const formData = {

    };

    try {
      await generatePdf(formData, flag);

      if (edit) {
        await ReportsApi.update(current.labSrNo, formData);
      } else {
        await ReportsApi.save(current, formData);
      }

      setError("");
      setMessage("Report saved successfully");
      showModal();
    } catch (err) {
      console.log(err);
      setMessage("");
      setError(`${err}`);
    }

    setLoading(false);
  }

  const location = useLocation();
  useEffect(() => {
    async function fetchData() {
      const queryParams = new URLSearchParams(location.search);
      const labSrNo = queryParams.get("edit");
      setFetching(true);

      if (!labSrNo) {
        // Make new Report
        const data = await ReportsApi.getCurrent();

        setReport(data);
        setEdit(false);
        setFetching(false);
      } else {
        // Edit Existing Report

        const data = await ReportsApi.getById(labSrNo);

        if (data) {
          setReport(data);
          setEdit(true);
        } 
        else {
          alert("Report Not Found !, Invalid Lab Sr No.");
          history.push("/dashboard/reports");
        }

        setFetching(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {fetching && (
        <Container className="pt-4 text-center">
          <img src="/assets/images/loader.gif" alt="loader" />
        </Container>
      )}
      {!fetching && (
        <Container className="pt-4">
          <Row className="fill-report-icon text-center">
              <img
                src="/assets/images/fill-report.png"
                alt="fill-report-icon"
                style={{ width: "5rem" }}
              />
          </Row>

          <Formik
            initialValues={ 
                edit ? 
                report : 
                { 
                  labSrNo: `MT_${report.lab + 1}`,
                  refrenceNo: `MT_${report.refrence + 1}`,
                  ...REPORT_FIELDS
                } 
            }
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              console.log(values);
            }}
          >
            <Form>
              <br />
              <br />
              <Row>
                <Col>
                    <TextField name="labSrNo" label="Lab Sr No."  disabled={true}/>
                </Col>
                <Col>
                    <TextField name="refrenceNo" label="Reference No."  disabled={true}/>                    
                </Col>
              </Row>
              <br />
              <br />
              <Heading> Candidate Information </Heading>
              <Row>
                <Col title="Date">
                      <DateField name="dateExamined" label="Examined Date" required/>
                      <ExpiryDateField name="dateExpiry" label="Expiry Date" disabled={true} required/>
                </Col>
                <Col title="Upload Photo">
                  <FileUpload />                
                </Col>
                <Col> 
                  <DisplayPhoto />
                </Col>
              </Row>
              <br />
              <br />
              <Row>
                <Col>
                      <TextField name="fullName" label="Full Name" required/>
                      <TextField name="age" label="Age" required/>
                      <SelectField name="gender" label="Gender" required>
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </SelectField>
                      <TextFieldWithUnit name="height" label="Height" unit="cm" />
                </Col>
                <Col>
                      <TextFieldWithUnit name="weight" label="Weight" unit="kg" />
                      <SelectField name="maritalStatus" label="Marital Status" required>
                          <option value="">-- Select --</option>
                          <option value="Married"> Married </option>
                          <option value="Unmarried"> Unmarried </option>
                      </SelectField>
                      <DateField name="dob" label="Date of Birth" required/>
                      <DateField name="doi" label="Date of Issue" required/>
                </Col>
                <Col>
                    <TextField name="poi" label="Place of Issue" required/>
                    <TextField name="nationality" label="Nationality" required/>
                    <TextField name="passport" label="Passport No." required/>
                    <TextField name="post" label="Post applied for." required/>
                </Col>
              </Row>

              {/* Medical Examination Form */}
              <br />
              <Heading>Medical examination</Heading>
              <Row>
                <Col title="EYES">
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
                </Col>
                <Col title="EARS">
                      <TextField name="rightEar" label="Right Ear" />
                      <TextField name="leftEar" label="Left Ear" />
                </Col>
                <Col title="SYSTEMATIC EXAM">
                      <TextFieldWithUnit name="bloodPressure" label="Blood Pressure" unit="mm Hg" />
                      <TextField name="heart" label="Heart" />
                      <TextField name="lungs" label="Lungs" />
                      <TextField name="abdomen" label="Abdomen" />
                </Col>
              </Row>
              <br />
              <Row>
                <Col title="VENEREAL DISEASES (CLINICAL)">
                      <SelectField name="VDRLorTPHA" label="VDRL/TPHA">
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                      </SelectField>
                </Col>
                <Col title="CHEST X-RAY">
                      <TextField name="chest" label="" />
                </Col>
                <Col title="PREGNANCY">
                      <Pregnancy />
                </Col>
              </Row>
              {/* Medical Examination Form */}
              <br />

              {/* LAB INVESTIGATION Form */}
              <br />
              <h4
                style={{ textTransform: "uppercase" }}
                className="text-center pt-4 pb-4"
              >
                lab INVESTIGATION
              </h4>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>URINE</Card.Title>

                      <Form.Group id="sugar">
                        <Form.Label>Sugar</Form.Label>
                        <Form.Control
                          type="text"
                          ref={sugarRef}
                          defaultValue={edit ? current.sugar : `NIL`}
                        />
                      </Form.Group>
                      <Form.Group id="albumin">
                        <Form.Label>Albumin</Form.Label>
                        <Form.Control
                          type="text"
                          ref={albuminRef}
                          defaultValue={edit ? current.albumin : `NIL`}
                        />
                      </Form.Group>
                      <Form.Group id="urine-bilharziasis">
                        <Form.Label>Bilharziasis</Form.Label>
                        <Form.Control
                          type="text"
                          ref={urineBilharziasisRef}
                          defaultValue={edit ? current.urineBilharziasis : `NIL`}
                        />
                      </Form.Group>
                      <Form.Group id="urine-others">
                        <Form.Label>Others</Form.Label>
                        <Form.Control
                          type="text"
                          ref={urineOthersRef}
                          defaultValue={edit ? current.urineOthers : ``}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>BLOOD</Card.Title>

                      <Form.Group id="hemoglobin">
                        <Form.Label>Hemoglobin</Form.Label>
                        <Form.Control
                          type="text"
                          ref={hemoglobinRef}
                          defaultValue={edit ? current.hemoglobin : ``}
                          style={{ display: "inline" }}
                        />
                        <span style={{ marginLeft: "-4rem" }}>gm %</span>
                      </Form.Group>
                      <Form.Group id="malaria-film">
                        <Form.Label>Malaria Film</Form.Label>
                        <Form.Control
                          type="text"
                          ref={malariaFilmRef}
                          defaultValue={edit ? current.malariaFilm : `Not Seen`}
                        />
                      </Form.Group>
                      <Form.Group id="micro-filaria">
                        <Form.Label>Micro Filaria</Form.Label>
                        <Form.Control
                          as="select"
                          ref={microFilariaRef}
                          defaultValue={
                            edit ? current.microFilaria : `Non-Reactive`
                          }
                          custom
                        >
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group id="blood-group">
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Control
                          as="select"
                          ref={bloodGroupRef}
                          defaultValue={edit ? current.bloodGroup : ``}
                          custom
                        >
                          <option value="">-- Select --</option>

                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="O+">O+</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O-">O-</option>
                          <option value="B-">B-</option>
                          <option value="A-">A-</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group id="blood-others">
                        <Form.Label>Others</Form.Label>
                        <Form.Control
                          type="text"
                          ref={bloodOthersRef}
                          defaultValue={edit ? current.bloodOthers : ``}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>STOOL</Card.Title>

                      <Form.Group id="helminths">
                        <Form.Label>Helminths</Form.Label>
                        <Form.Control
                          type="text"
                          ref={helminthsRef}
                          defaultValue={edit ? current.helminths : `Not Seen`}
                        />
                      </Form.Group>
                      <Form.Group id="stool-bilharziasis">
                        <Form.Label>Bilharziasis</Form.Label>
                        <Form.Control
                          type="text"
                          ref={stoolBilharziasisRef}
                          defaultValue={
                            edit ? current.stoolBilharziasis : `Not Seen`
                          }
                        />
                      </Form.Group>
                      <Form.Group id="salmonella-shigella">
                        <Form.Label>Salmonella/Shigella</Form.Label>
                        <Form.Control
                          type="text"
                          ref={salmonellaShigellaRef}
                          defaultValue={edit ? current.salmonellaShigella : `NAD`}
                        />
                      </Form.Group>
                      <Form.Group id="v-cholera">
                        <Form.Label>V. Cholera</Form.Label>
                        <Form.Control
                          type="text"
                          ref={choleraRef}
                          defaultValue={edit ? current.cholera : `NAD`}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>SEROLOGY</Card.Title>
                      <Form.Group id="hiv">
                        <Form.Label>HIV</Form.Label>
                        <Form.Control
                          as="select"
                          ref={hivRef}
                          defaultValue={edit ? current.hiv : `Non-Reactive`}
                          custom
                        >
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group id="hbsag">
                        <Form.Label>HBsAg</Form.Label>
                        <Form.Control
                          as="select"
                          ref={hbsagRef}
                          defaultValue={edit ? current.hbsag : `Non-Reactive`}
                          custom
                        >
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group id="anti-hcv">
                        <Form.Label>Anti HCV</Form.Label>
                        <Form.Control
                          as="select"
                          ref={antiHCVRef}
                          defaultValue={edit ? current.antiHCV : `Non-Reactive`}
                          custom
                        >
                          <option value="">-- Select --</option>
                          <option value="Reactive">Reactive</option>
                          <option value="Non-Reactive">Non-Reactive</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group id="lft">
                        <Form.Label>L.F.T.</Form.Label>
                        <Form.Control
                          type="text"
                          ref={lftRef}
                          defaultValue={edit ? current.lft : `Normal`}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>SEROLOGY</Card.Title>
                      <Form.Group id="urea">
                        <Form.Label>Urea</Form.Label>
                        <Form.Control
                          type="text"
                          ref={ureaRef}
                          defaultValue={edit ? current.urea : ``}
                          style={{ display: "inline" }}
                        />
                        <span style={{ marginLeft: "-4rem" }}>mg/dl</span>
                      </Form.Group>
                      <Form.Group id="creatinine">
                        <Form.Label>Creatinine</Form.Label>
                        <Form.Control
                          type="text"
                          ref={creatinineRef}
                          defaultValue={edit ? current.creatinine : ``}
                          style={{ display: "inline" }}
                        />
                        <span style={{ marginLeft: "-4rem" }}>mg/dl</span>
                      </Form.Group>
                      <Form.Group id="blood-sugar">
                        <Form.Label>Blood Sugar</Form.Label>
                        <Form.Control
                          type="text"
                          ref={bloodSugarRef}
                          defaultValue={edit ? current.bloodSugar : ``}
                          style={{ display: "inline" }}
                        />
                        <span style={{ marginLeft: "-4rem" }}>mg/dl</span>
                      </Form.Group>
                      <Form.Group id="kft">
                        <Form.Label>K.F.T.</Form.Label>
                        <Form.Control
                          type="text"
                          ref={kftRef}
                          defaultValue={edit ? current.kft : `Normal`}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Covid</Card.Title>
                      <Form.Group>
                        <Form.Control
                          as="select"
                          className="covid"
                          ref={covidRef}
                          defaultValue={edit ? current.covid : ""}
                          custom
                        >
                          <option value="">-- Select --</option>
                          <option value="Positive"> Positive </option>
                          <option value="Negative"> Negative </option>
                        </Form.Control>
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {/* LAB INVESTIGATION Form */}

              <br />
              <br />
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Remarks</Card.Title>
                      <Form.Group>
                        <Form.Label>FIT or UNFIT</Form.Label>
                        <Form.Control
                          as="select"
                          className="fit"
                          ref={fitRef}
                          defaultValue={edit ? current.fit : ""}
                          custom
                        >
                          <option value="">-- Select --</option>
                          <option value="FIT"> FIT </option>
                          <option value="UNFIT"> UNFIT </option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Remarks:- </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          ref={remarksRef}
                          defaultValue={edit ? current.remarks : ``}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <div>
                    {error.length > 0 && <Alert variant="danger">{error}</Alert>}
                  </div>
                </Col>
              </Row>

              <br />
              <br />
              <Button
                disabled={loading}
                type="button"
                className="px-4 py-2"
                style={{ fontSize: "1.2rem", letterSpacing: "2px" }}
                onClick={() => generateReport(false)}
              >
                CREATE TEST REPORT
              </Button>
              <Button
                disabled={loading}
                type="button"
                className="px-4 py-2 ml-4"
                style={{ fontSize: "1.2rem", letterSpacing: "2px" }}
                onClick={() => generateReport(true)}
              >
                GENERATE FINAL REPORT
              </Button>
              {loading && <img src="/assets/images/loader.gif" alt="loader" className="ml-4" />}
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
