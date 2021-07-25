import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import ReportsApi from "../services/firebase.service";
import generatePdf from "../utils/pdfLib";
import { SEARCH_OPTIONS } from "../constants";

function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const searchRef = useRef();
  const selectRef = useRef();

  async function findReports(e) {
    e.preventDefault();
    setLoading(true);

    const value = searchRef.current.value.toUpperCase();
    const option = selectRef.current.value;

    // const api = new ReportsApi();
    const result = await ReportsApi.find(option, value);

    if (!result.empty) {
      setData(result.docs);
    } else {
      setData([]);
    }

    setLoading(false);
    return;
  }

  const deleteReport = async (id) => {
    setRemoving(true);

    const photoName = data
                      .find((report) => report.id === id)
                      .data()
                      .photoName;

    await ReportsApi.delete(photoName, id);

    const newData = data.filter((report) =>  report.id !== id);
    
    setData(newData);
    setRemoving(false);
  };

  const downloadReport = async (id, flag) => {
    setDownloading(true);
    const reportData = data.find((report) => report.id == id).data();
    await generatePdf(reportData, flag);
    setDownloading(false);
  }

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);

      // const api = new ReportsApi();
      const data = await ReportsApi.get();
      
      setData(data.docs);
      setLoading(false);
    }

    fetchReports();
  }, []);

  return (
    <Container className="pt-4 text-center">
      <Form onSubmit={findReports}>
        <Row>
          <Col className="text-left">
            <Form.Group>
              <Form.Label style={{ fontWeight: "bold" }}>Find By</Form.Label>
              <Form.Control as="select" ref={selectRef} custom>
                {Object.keys(SEARCH_OPTIONS).map((option, index) => {
                  return (<option value={SEARCH_OPTIONS[option]} key={index}>{option}</option>)
                })}
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
            <img src="/assets/images/loader.gif" alt="loader" />
          </Col>
        </Row>
      )}
      {data.length > 0 && (
        <Row className="mt-4">
          <Col className="text-center">
            <Table striped bordered hover>
              <thead style={{ fontWeight: "bold" }}>
                <tr>
                  <td> Lab Sr No </td>
                  <td> Full Name </td>
                  <td> Date Examined </td>
                  <td> Date Expiry </td>
                  <td> Date Of Birth </td>
                  <td> Passport No </td>
                  <td> Edit </td>
                  <td> Delete </td>
                  <td> Test Report </td>
                  <td> Final Report </td>

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
                        <Button
                          variant="primary"
                        >
                          <Link
                            style={{ color: '#fff', textDecoration: 'none'}}
                            to={`/dashboard/create-report?edit=${doc.data().labSrNo}`}
                          >
                            Edit
                          </Link>
                        </Button>
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
                      <td>
                        <Button
                          variant="success"
                          onClick={() => downloadReport(doc.id, false)}
                          disabled={downloading}
                        >
                          Download
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => downloadReport(doc.id, true)}
                          disabled={downloading}
                        >
                          Download
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

export default Reports;