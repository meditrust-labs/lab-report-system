import React, { useState } from "react";
import { Navbar, Nav, Button, Container, Modal } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import toast from 'react-hot-toast';

import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase.config";

export default function NavigationBar() {
  const { logout } = useAuth();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const closeModal = () => setShow(false);
  const showModal = () => setShow(true);

  async function updateRefrence() {
    setLoading(true);
    const id = toast.loading('Updating reference ...');

    try {
      const snapshot = await db.collection("current").get();
      const docId = snapshot.docs[0].id;
      await db.collection("current").doc(docId).update({ refrence: 0 });

      toast.success('Reference updated successfully', { id });
    } catch (err) {
      toast.error('An error occurred', { id });
      console.log(err);
    }

    closeModal();
    history.push("/dashboard");
    setLoading(false);
  }

  async function handleLogout() {
    const id = toast.loading('Logging you out!');

    try {
      await logout();
      toast.success('Logged out', { id });
    } catch (err) {
      toast.error('An error occurred', { id });
      console.log(err);
    }

    history.push("/");
  }

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container fluid>
          <Navbar.Brand>
            <img
              alt=""
              src="/assets/images/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              style={{ marginRight: "1rem" }}
            />
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                cursor: "pointer",
                color: "#000",
                fontWeight: "500",
              }}
            >
              MEDITRUST LAB
            </Link>
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Button
              className="btn btn-primary"
              style={{ marginRight: "1rem" }}
              onClick={() => {
                if (window.location.href.includes("edit")) {
                  history.push("/dashboard/create-report");
                  window.location.reload();
                } else {
                  history.push("/dashboard/create-report");
                }
              }}
            >
              New Report
            </Button>

            <Link
              className="btn btn-dark"
              to="/dashboard/reports"
              style={{ marginRight: "6rem" }}
            >
              Find Report
            </Link>

            <Link
              className="btn btn-outline-primary"
              to="/dashboard/change-password"
              style={{ marginLeft: "1rem", marginRight: "1rem" }}
            >
              Change Password
            </Link>
            <Button onClick={showModal}>Reset Refrence</Button>
            <Button
              variant="primary"
              onClick={handleLogout}
              style={{ marginLeft: "1rem" }}
            >
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Refrence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to reset refrence value to 0? This action can't be
          reversed !
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={updateRefrence}
            disabled={loading}
          >
            Reset Refrence
          </Button>
          <Button variant="primary" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
