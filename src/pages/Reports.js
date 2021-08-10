import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import toast from 'react-hot-toast';

import { TableView } from '@Components'
import ReportsApi from "@Services/firebase.service";
import { SEARCH_OPTIONS } from "../constants";

export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef();
  const selectRef = useRef();

  async function findReports() {
    setLoading(true);

    const query = searchRef.current.value.toUpperCase();
    const option = selectRef.current.value;

    if (query.length === 0) {
      setLoading(false);
      return;
    }

    let result;
    if (option === 'labSrNo')
      result = await ReportsApi.searchByLabSrNo(query);
    else if (option === 'fullName')
      result = await ReportsApi.searchByName(query);
      
    if (!result.empty) {
      setData(result.docs);
    } else {
      setData([]);
    }

    setLoading(false);
    return;
  }

  async function fetchReports(e) {
    setLoading(true);

    if (e)
      e.preventDefault();
    const toastId = toast.loading("Loading report...");
      
    try {
      const reports = await ReportsApi.get();
      setData(reports.docs);
      toast.success(`Fetched ${reports.docs.length} reports`, {id: toastId});
    }
    catch (err) {
      console.log(err);
      toast.error("An error occured!", {id: toastId});
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Container className="p-4 text-center" fluid>
      <Form onSubmit={(e) => fetchReports(e)}>
        <Row
          style={{
            justifyContent: "center",
            marginLeft: '2rem'
          }}
        >

          <Col className="text-left" xs={2}>
            <Form.Group>
              <Form.Label
                style={{
                  fontWeight: "bold"
                }}>
                Find By
              </Form.Label>
              <Form.Control
                as="select"
                ref={selectRef}
                custom
              >
                {Object
                  .keys(SEARCH_OPTIONS)
                  .map((option, index) => {
                    return (
                      <option
                        value={SEARCH_OPTIONS[option]}
                        key={index}
                      >
                        {option}
                      </option>
                    )
                })}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              style={{
                marginTop: "2rem  "
              }}
            >
              <Form.Control
                type="text"
                placeholder="search reports"
                ref={searchRef}
                onChange={findReports}
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
                maxwidth: '100%'
              }}
            >
              RELOAD LATEST REPORTS
            </Button>
          </Col>
        </Row>
      </Form>
      <Row
        style={{
          justifyContent: "center"
        }}
      >
        {
          loading &&
          <img
            src="/assets/images/search-loader.gif"
            alt="infinity"
            style={{
              width: '2rem',
            }}
          />
        }
      </Row>
      {
        data.length === 0 && (
          <Row>
            <Col className="text-center">
              <p>No Records Found!</p>
            </Col>
          </Row>
        )
      }
      {
        data.length > 0 && (
          <TableView
            data={data}
            updateData={(data) => setData(data)}
          />
        )
      }

    </Container>
  );
}
