import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { db, storage } from "../firebase";

function FindReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const options = [
    "labSrNo",
    "dateExamined",
    "dateExpiry",
    "fullName",
    "dob",
    "passport",
  ];
  const searchRef = useRef();
  const selectRef = useRef();

  async function findReports(e) {
    e.preventDefault();
    setLoading(true);

    let value = searchRef.current.value.toUpperCase();
    const idx = selectRef.current.options.selectedIndex;
    const option = options[idx];

    const reportsRef = db.collection("reports");
    let querySnapshot;

    try {
      if (value.length == 0) {
        querySnapshot = await reportsRef
          .orderBy("labSrNo", "desc")
          .limit(15)
          .get();

        // console.log("0 length", querySnapshot);
      } else {
        querySnapshot = await reportsRef.where(option, "==", value).get();
        // console.log("value", value, querySnapshot);
      }
    } catch (err) {
      console.log(err);
    }

    if (!querySnapshot.empty) {
      setData(querySnapshot.docs);
    } else {
      setData([]);
    }

    setLoading(false);
    return;
  }

  async function fetchReports() {
    setLoading(true);
    try {
      const snapshot = await db
        .collection("reports")
        .orderBy("labSrNo", "desc")
        .limit(15)
        .get();
      setData(snapshot.docs);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const deleteReport = async (id) => {
    setRemoving(true);
    try {
      const photoName = data.find((report) => report.id === id).data()
        .photoName;

      const deleteReport = db.collection("reports").doc(id).delete();
      const deletePhoto = storage.ref().child(`images/${photoName}`).delete();

      await Promise.all([deleteReport, deletePhoto]);
    } catch (err) {
      console.log(err);
    }
    setRemoving(false);
    await fetchReports();
  };

  return (
    <Container className="pt-4 text-center">
      <Form onSubmit={findReports}>
        <Row>
          <Col className="text-left">
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>Find By</Form.Label>
              <Form.Control as="select" ref={selectRef} custom>
                <option>Lab Sr No.</option>
                <option>Date Examined</option>
                <option>Date Expiry</option>
                <option>Name</option>
                <option>Date of Birth</option>
                <option>Passport Number</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={7}>
            <Form.Group style={{ marginTop: "8px" }}>
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="search reports"
                ref={searchRef}
              />
            </Form.Group>
          </Col>
          <Col>
            <Button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "2rem",
                marginLeft: "-4rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
                letterSpacing: ".2rem",
                fontWeight: "400",
                textTransform: "capitalize",
              }}
            >
              SEARCH
            </Button>
          </Col>
        </Row>
      </Form>
      {loading && (
        <Row>
          <Col className="text-center">
            <img src="/830.gif" alt="loader" />
          </Col>
        </Row>
      )}
      {data.length > 0 && (
        <Row className="mt-4">
          <Col className="text-center">
            <Table striped bordered hover>
              <thead style={{ fontWeight: "bold" }}>
                <tr>
                  <td>Lab Sr No</td>
                  <td> Full Name </td>
                  <td> Date Examined </td>
                  <td> Date Expiry </td>
                  <td> Date Of Birth </td>
                  <td> Passport No </td>
                  <td> Edit </td>
                  <td> Delete </td>
                </tr>
              </thead>
              <tbody>
                {data.map((doc) => {
                  return (
                    <tr key={doc.id}>
                      <td>{doc.data().labSrNo}</td>
                      <td>{doc.data().fullName}</td>
                      <td>{doc.data().dateExamined}</td>
                      <td>{doc.data().dateExpiry}</td>
                      <td>{doc.data().dob}</td>
                      <td>{doc.data().passport}</td>
                      <td>
                        <Link
                          to={`/dashboard/report?edit=${doc.data().labSrNo}`}
                        >
                          Edit
                        </Link>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deleteReport(doc.id)}
                          disabled={removing}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
      {data.length === 0 && (
        <Row>
          <Col className="text-center">
            <p>No Records</p>
          </Col>
        </Row>
      )}
    </Container>
  );
}
export default FindReport;
