import React, { useRef, useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

import { storage, db } from "../firebase";
import generatePdf from "../pdfLib";

function MakeReport() {
  const fullNameRef = useRef();
  const ageRef = useRef();
  const genderRef = useRef();
  const maritalStatusRef = useRef();
  const heightRef = useRef();
  const weightRef = useRef();
  const dobRef = useRef();
  const doiRef = useRef();
  const poiRef = useRef();
  const nationalityRef = useRef();
  const passportRef = useRef();
  const postRef = useRef();

  const visionLeftEyeRef = useRef();
  const otherLeftEyeRef = useRef();
  const visionRightEyeRef = useRef();
  const otherRightEyeRef = useRef();

  const leftEarRef = useRef();
  const rightEarRef = useRef();

  const bloodPressureRef = useRef();
  const heartRef = useRef();
  const lungsRef = useRef();
  const abdomenRef = useRef();

  const VDRLorTPHA_Ref = useRef();
  // const tphaRef = useRef();

  const chestRef = useRef();
  const pregnancyRef = useRef();

  const sugarRef = useRef();
  const albuminRef = useRef();
  const urineBilharziasisRef = useRef();
  const urineOthersRef = useRef();

  const hemoglobinRef = useRef();
  const malariaFilmRef = useRef();
  const microFilariaRef = useRef();
  const bloodGroupRef = useRef();
  const bloodOthersRef = useRef();

  const helminthsRef = useRef();
  const stoolBilharziasisRef = useRef();
  const salmonellaShigellaRef = useRef();
  const choleraRef = useRef();

  const hivRef = useRef();
  const hbsagRef = useRef();
  const antiHCVRef = useRef();
  const lftRef = useRef();
  const ureaRef = useRef();
  const creatinineRef = useRef();
  const bloodSugarRef = useRef();
  const kftRef = useRef();

  const fitRef = useRef();
  const remarksRef = useRef();
  const covidRef = useRef();

  const labSrNoRef = useRef();
  const refrenceNoRef = useRef();
  const dateExaminedRef = useRef();
  const dateExpiryRef = useRef();

  const [photoUrl, setPhotoUrl] = useState("");
  const [photo, setPhoto] = useState();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState({});
  const [fetching, setFetching] = useState(true);
  const [edit, setEdit] = useState(false);

  function convertDate(value) {
    let date = value.split("-");
    let temp = date[0];
    date[0] = date[2];
    date[2] = temp;
    date = date.join("-");
    return date;
  }

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  }

  function uploadFile() {
    setLoading(true);
    const uploadTask = storage.ref(`images/${photo.name}`).put(photo);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(photo.name)
          .getDownloadURL()
          .then((url) => {
            setPhotoUrl(url);
            setLoading(false);
          });
      }
    );
  }

  async function updateReport(formData, candidatePhoto) {
    try {
      await db
        .collection("reports")
        .doc(current.labSrNo)
        .update({ ...formData, candidatePhoto });
    } catch (err) {
      console.log(err);
    }
  }

  async function saveReport(formData, candidatePhoto) {
    try {
      await db
        .collection("reports")
        .doc(`EMPTY_${current.lab + 1}`)
        .set({ ...formData, candidatePhoto });

      await db
        .collection("current")
        .doc(current.id)
        .update({
          lab: current.lab + 1,
          refrence: current.refrence + 1,
        });
    } catch (err) {
      console.log(err);
    }
  }

  const history = useHistory();
  async function generateReport(e) {
    e.preventDefault();
    setLoading(true);

    const formData = {
      labSrNo: labSrNoRef.current.value,
      refrenceNo: refrenceNoRef.current.value,
      dateExamined: convertDate(dateExaminedRef.current.value),
      dateExpiry: convertDate(dateExpiryRef.current.value),
      fullName: fullNameRef.current.value.toUpperCase(),
      age: ageRef.current.value,
      gender: genderRef.current.value,
      height: heightRef.current.value,
      weight: weightRef.current.value,
      maritalStatus: maritalStatusRef.current.value,
      dob: convertDate(dobRef.current.value),
      nationality: nationalityRef.current.value,
      passport: passportRef.current.value.toUpperCase(),
      doi: convertDate(doiRef.current.value),
      poi: poiRef.current.value,
      post: postRef.current.value,
      visionRightEye: visionRightEyeRef.current.value,
      otherRightEye: otherRightEyeRef.current.value,
      visionLeftEye: visionLeftEyeRef.current.value,
      otherLeftEye: otherLeftEyeRef.current.value,
      sugar: sugarRef.current.value,
      albumin: albuminRef.current.value,
      urineBilharziasis: urineBilharziasisRef.current.value,
      urineOthers: urineOthersRef.current.value,
      rightEar: rightEarRef.current.value,
      leftEar: leftEarRef.current.value,
      hemoglobin: hemoglobinRef.current.value,
      malariaFilm: malariaFilmRef.current.value,
      bloodGroup: bloodGroupRef.current.value,
      microFilaria: microFilariaRef.current.value,
      bloodOthers: bloodOthersRef.current.value,
      bloodPressure: bloodPressureRef.current.value,
      heart: heartRef.current.value,
      lungs: lungsRef.current.value,
      abdomen: abdomenRef.current.value,
      helminths: helminthsRef.current.value,
      stoolBilharziasis: stoolBilharziasisRef.current.value,
      salmonellaShigella: salmonellaShigellaRef.current.value,
      cholera: choleraRef.current.value,
      VDRLorTPHA: VDRLorTPHA_Ref.current.value,
      // tpha: tphaRef.current.value,
      chest: chestRef.current.value,
      pregnancy: pregnancyRef.current.value,
      hiv: hivRef.current.value,
      hbsag: hbsagRef.current.value,
      antiHCV: antiHCVRef.current.value,
      lft: lftRef.current.value,
      urea: ureaRef.current.value,
      creatinine: creatinineRef.current.value,
      bloodSugar: bloodSugarRef.current.value,
      kft: kftRef.current.value,
      remarks: remarksRef.current.value,
      fit: fitRef.current.value,
      covid: covidRef.current.value,
    };

    const candidatePhoto = photoUrl;

    try {
      await generatePdf(formData, candidatePhoto);
      if (edit) {
        await updateReport(formData, candidatePhoto);
      } else {
        await saveReport(formData, candidatePhoto);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    history.push("/dashboard");
  }

  const location = useLocation();
  useEffect(() => {
    async function fetchData() {
      const queryParams = new URLSearchParams(location.search);
      const labSrNo = queryParams.get("edit");

      if (!labSrNo) {
        // Make new Report
        try {
          const querySnapshot = await db.collection("current").get();
          querySnapshot.forEach((doc) => {
            setCurrent({ id: doc.id, ...doc.data() });
            setEdit(false);
            setFetching(false);
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        // Edit Existing Report
        try {
          const doc = await db.collection("reports").doc(labSrNo).get();
          if (doc.exists) {
            let data = doc.data();
            data["dateExamined"] = convertDate(data["dateExamined"]);
            data["dateExpiry"] = convertDate(data["dateExpiry"]);
            data["dob"] = convertDate(data["dob"]);
            data["doi"] = convertDate(data["doi"]);

            setCurrent(data);
            setEdit(true);
            setPhotoUrl(doc.data().candidatePhoto);
            setFetching(false);
          } else {
            console.log("no such doc");
            history.push("/dashboard/search");
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    fetchData();
  }, [location]);

  return (
    <>
      {fetching && (
        <Container className="pt-4 text-center">
          <img src="/830.gif" alt="loader" />
        </Container>
      )}
      {!fetching && (
        <Container className="pt-4">
          <Row className="fill-report-icon text-center">
            <Col>
              <img
                src="/fill-report.png"
                alt="fill-report-icon"
                style={{ width: "5rem" }}
              />
            </Col>
          </Row>
          <Form onSubmit={generateReport}>
            <br />
            <br />
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Lab Sr No.</Card.Title>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        ref={labSrNoRef}
                        disabled={true}
                        value={
                          edit ? current.labSrNo : `EMPTY_${current.lab + 1}`
                        }
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Reference No.</Card.Title>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        ref={refrenceNoRef}
                        disabled={true}
                        value={
                          edit
                            ? current.refrenceNo
                            : `EMPTY_${current.refrence + 1}`
                        }
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <br />
            <br />
            <h4
              style={{ textTransform: "uppercase" }}
              className="text-center pt-4 pb-4"
            >
              candidate information
            </h4>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Date</Card.Title>
                    <Form.Group id="date-examined">
                      <Form.Label>Date Examined</Form.Label>
                      <Form.Control
                        type="date"
                        ref={dateExaminedRef}
                        defaultValue={edit ? current.dateExamined : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="date-expiry">
                      <Form.Label>Date Expiry</Form.Label>
                      <Form.Control
                        type="date"
                        ref={dateExpiryRef}
                        defaultValue={edit ? current.dateExpiry : ``}
                        required
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Upload Photo</Card.Title>
                    <Form.Group>
                      <Form.File
                        id="photo"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Button
                      type="button"
                      onClick={uploadFile}
                      disabled={loading}
                    >
                      Upload
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                {photoUrl.length > 0 && (
                  <Card>
                    <Card.Body>
                      <img
                        src={photoUrl}
                        alt="candidate"
                        style={{ width: "5.9rem" }}
                      />
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Form.Group id="full-name">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        ref={fullNameRef}
                        defaultValue={edit ? current.fullName : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="age">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        ref={ageRef}
                        defaultValue={edit ? current.age : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="gender">
                      <Form.Label>Gender</Form.Label>
                      <Form.Control
                        type="text"
                        ref={genderRef}
                        defaultValue={edit ? current.gender : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="height">
                      <Form.Label>Height (cm)</Form.Label>
                      <Form.Control
                        type="number"
                        ref={heightRef}
                        defaultValue={edit ? current.height : ``}
                        required
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Form.Group id="weight">
                      <Form.Label>Weight (Kg) </Form.Label>
                      <Form.Control
                        type="number"
                        ref={weightRef}
                        defaultValue={edit ? current.weight : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="marital-status">
                      <Form.Label> Marital Status </Form.Label>
                      <Form.Control
                        type="text"
                        ref={maritalStatusRef}
                        defaultValue={edit ? current.maritalStatus : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="date-of-birth">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        ref={dobRef}
                        defaultValue={edit ? current.dob : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="date-of-issue">
                      <Form.Label>Date of Issue</Form.Label>
                      <Form.Control
                        type="date"
                        ref={doiRef}
                        defaultValue={edit ? current.doi : ``}
                        required
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>

              <Col>
                <Card>
                  <Card.Body>
                    <Form.Group id="place-of-issue">
                      <Form.Label>Place of Issue</Form.Label>
                      <Form.Control
                        type="text"
                        ref={poiRef}
                        defaultValue={edit ? current.poi : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="nationality">
                      <Form.Label>Nationality</Form.Label>
                      <Form.Control
                        type="text"
                        ref={nationalityRef}
                        defaultValue={edit ? current.nationality : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="passport-no">
                      <Form.Label>Passport No</Form.Label>
                      <Form.Control
                        type="text"
                        ref={passportRef}
                        defaultValue={edit ? current.passport : ``}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="post">
                      <Form.Label> Post applied for </Form.Label>
                      <Form.Control
                        type="text"
                        ref={postRef}
                        defaultValue={edit ? current.post : ``}
                        required
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Medical Examination Form */}
            <br />
            <h4
              style={{ textTransform: "uppercase" }}
              className="text-center pt-4 pb-4"
            >
              Medical examination
            </h4>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>EYES</Card.Title>
                    <Form.Group id="vision-right-eye">
                      <Form.Label>Vision Right Eye</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={edit ? current.visionRightEye : ``}
                        ref={visionRightEyeRef}
                      />
                    </Form.Group>
                    <Form.Group id="other-right-eye">
                      <Form.Label>Other Right Eye</Form.Label>
                      <Form.Control
                        type="text"
                        ref={otherRightEyeRef}
                        defaultValue={edit ? current.otherRightEye : ``}
                      />
                    </Form.Group>
                    <Form.Group id="vision-left-eye">
                      <Form.Label>Vision Left Eye</Form.Label>
                      <Form.Control
                        type="text"
                        ref={visionLeftEyeRef}
                        defaultValue={edit ? current.visionLeftEye : ``}
                      />
                    </Form.Group>
                    <Form.Group id="other-left-eye">
                      <Form.Label>Other Left Eye</Form.Label>
                      <Form.Control
                        type="text"
                        ref={otherLeftEyeRef}
                        defaultValue={edit ? current.otherLeftEye : ``}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>EARS</Card.Title>
                    <Form.Group id="right-ear">
                      <Form.Label>Right Ear</Form.Label>
                      <Form.Control
                        type="text"
                        ref={rightEarRef}
                        defaultValue={edit ? current.rightEar : ``}
                      />
                    </Form.Group>
                    <Form.Group id="left-ear">
                      <Form.Label>Left Ear</Form.Label>
                      <Form.Control
                        type="text"
                        ref={leftEarRef}
                        defaultValue={edit ? current.leftEar : ``}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>SYSTEMATIC EXAM</Card.Title>
                    <Form.Group id="blood-pressure">
                      <Form.Label>Blood Pressure</Form.Label>
                      <Form.Control
                        type="text"
                        ref={bloodPressureRef}
                        defaultValue={edit ? current.bloodPressure : ``}
                      />
                    </Form.Group>
                    <Form.Group id="heart">
                      <Form.Label>Heart</Form.Label>
                      <Form.Control
                        type="text"
                        ref={heartRef}
                        defaultValue={edit ? current.heart : ``}
                      />
                    </Form.Group>
                    <Form.Group id="lungs">
                      <Form.Label>Lungs</Form.Label>
                      <Form.Control
                        type="text"
                        ref={lungsRef}
                        defaultValue={edit ? current.lungs : ``}
                      />
                    </Form.Group>
                    <Form.Group id="abdomen">
                      <Form.Label>Abdomen</Form.Label>
                      <Form.Control
                        type="text"
                        ref={abdomenRef}
                        defaultValue={edit ? current.abdomen : ``}
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
                    <Card.Title>VENEREAL DISEASES (CLINICAL)</Card.Title>
                    <Form.Group id="vdrl">
                      <Form.Label>VDRL/TPHA</Form.Label>
                      <Form.Control
                        type="text"
                        ref={VDRLorTPHA_Ref}
                        defaultValue={edit ? current.VDRLorTPHA : ``}
                      />
                    </Form.Group>
                    {/* <Form.Group id="tpha">
                      <Form.Label>TPHA</Form.Label>
                      <Form.Control
                        type="text"
                        ref={tphaRef}
                        defaultValue={edit ? current.tpha : ``}
                      />
                    </Form.Group> */}
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>CHEST X-RAY</Card.Title>
                    <Form.Group id="chest-x-ray">
                      <Form.Label></Form.Label>
                      <Form.Control
                        type="text"
                        ref={chestRef}
                        defaultValue={edit ? current.chest : ``}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>PREGNANCY</Card.Title>
                    <Form.Group id="pregnancy">
                      <Form.Label></Form.Label>
                      <Form.Control
                        type="text"
                        ref={pregnancyRef}
                        defaultValue={edit ? current.pregnancy : ``}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
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
                        defaultValue={edit ? current.sugar : ``}
                      />
                    </Form.Group>
                    <Form.Group id="albumin">
                      <Form.Label>Albumin</Form.Label>
                      <Form.Control
                        type="text"
                        ref={albuminRef}
                        defaultValue={edit ? current.albumin : ``}
                      />
                    </Form.Group>
                    <Form.Group id="urine-bilharziasis">
                      <Form.Label>Bilharziasis</Form.Label>
                      <Form.Control
                        type="text"
                        ref={urineBilharziasisRef}
                        defaultValue={edit ? current.urineBilharziasis : ``}
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
                      />
                    </Form.Group>
                    <Form.Group id="malaria-film">
                      <Form.Label>Malaria Film</Form.Label>
                      <Form.Control
                        type="text"
                        ref={malariaFilmRef}
                        defaultValue={edit ? current.malariaFilm : ``}
                      />
                    </Form.Group>
                    <Form.Group id="micro-filaria">
                      <Form.Label>Micro Filaria</Form.Label>
                      <Form.Control
                        type="text"
                        ref={microFilariaRef}
                        defaultValue={edit ? current.microFilaria : ``}
                      />
                    </Form.Group>
                    <Form.Group id="blood-group">
                      <Form.Label>Blood Group</Form.Label>
                      <Form.Control
                        type="text"
                        ref={bloodGroupRef}
                        defaultValue={edit ? current.bloodGroup : ``}
                      />
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
                        defaultValue={edit ? current.helminths : ``}
                      />
                    </Form.Group>
                    <Form.Group id="stool-bilharziasis">
                      <Form.Label>Bilharziasis</Form.Label>
                      <Form.Control
                        type="text"
                        ref={stoolBilharziasisRef}
                        defaultValue={edit ? current.stoolBilharziasis : ``}
                      />
                    </Form.Group>
                    <Form.Group id="salmonella-shigella">
                      <Form.Label>Salmonella/Shigella</Form.Label>
                      <Form.Control
                        type="text"
                        ref={salmonellaShigellaRef}
                        defaultValue={edit ? current.salmonellaShigella : ``}
                      />
                    </Form.Group>
                    <Form.Group id="v-cholera">
                      <Form.Label>V. Cholera</Form.Label>
                      <Form.Control
                        type="text"
                        ref={choleraRef}
                        defaultValue={edit ? current.cholera : ``}
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
                        type="text"
                        ref={hivRef}
                        defaultValue={edit ? current.hiv : ``}
                      />
                    </Form.Group>
                    <Form.Group id="hbsag">
                      <Form.Label>HBsAg</Form.Label>
                      <Form.Control
                        type="text"
                        ref={hbsagRef}
                        defaultValue={edit ? current.hbsag : ``}
                      />
                    </Form.Group>
                    <Form.Group id="anti-hcv">
                      <Form.Label>Anti HCV</Form.Label>
                      <Form.Control
                        type="text"
                        ref={antiHCVRef}
                        defaultValue={edit ? current.antiHCV : ``}
                      />
                    </Form.Group>
                    <Form.Group id="lft">
                      <Form.Label>L.F.T.</Form.Label>
                      <Form.Control
                        type="text"
                        ref={lftRef}
                        defaultValue={edit ? current.lft : ``}
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
                      />
                    </Form.Group>
                    <Form.Group id="creatinine">
                      <Form.Label>Creatinine</Form.Label>
                      <Form.Control
                        type="text"
                        ref={creatinineRef}
                        defaultValue={edit ? current.creatinine : ``}
                      />
                    </Form.Group>
                    <Form.Group id="blood-sugar">
                      <Form.Label>Blood Sugar</Form.Label>
                      <Form.Control
                        type="text"
                        ref={bloodSugarRef}
                        defaultValue={edit ? current.bloodSugar : ``}
                      />
                    </Form.Group>
                    <Form.Group id="kft">
                      <Form.Label>K.F.T.</Form.Label>
                      <Form.Control
                        type="text"
                        ref={kftRef}
                        defaultValue={edit ? current.kft : ``}
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
                        defaultValue={edit ? current.covid : "Negative"}
                        custom
                      >
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
                        defaultValue={edit ? current.fit : "UNFIT"}
                        custom
                      >
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
              <Col></Col>
            </Row>

            <br />
            <br />
            <Button
              disabled={loading}
              type="submit"
              className="px-4 py-2"
              style={{ fontSize: "1.2rem", letterSpacing: "2px" }}
            >
              GENERATE REPORT
            </Button>
            {loading && <img src="/830.gif" alt="loader" className="ml-4" />}
          </Form>
          <br />
          <br />
          <br />
        </Container>
      )}
    </>
  );
}

export default MakeReport;
