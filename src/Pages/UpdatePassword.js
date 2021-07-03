import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";

import { useAuth } from "../contexts/AuthContext";

function UpdatePassword() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const passwordRef = useRef();

  const { updatePassword, logout } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value.length > 0) {

      try {
        setError("");
        setMessage("");
        setLoading(true);

        await updatePassword(passwordRef.current.value);
        setMessage("Password changed successfully ! Please login again");

        setTimeout(async () => {
          await logout();
          history.push("/");
        }, 1000);
      } catch (err) {
        console.log(err);
        setError(err.message);
      }

      setLoading(false);
    } else {
      setError("please fill the empty fields");
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "30vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            {error.length > 0 && <Alert variant="danger">{error}</Alert>}
            {message.length > 0 && <Alert variant="success">{message}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button
                className="w-100 text-center"
                disabled={loading}
                type="submit"
              >
                Update Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default UpdatePassword;
