import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";

import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      emailRef.current.value.length > 0 &&
      passwordRef.current.value.length > 0
    ) {
      //
      try {
        setError("");
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        history.push("/dashboard");
      } catch (err) {
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
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Log In</h2>
        <Card>
          <Card.Body>
            {error.length > 0 && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>

              <Button
                className="w-100 text-center"
                disabled={loading}
                type="submit"
              >
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="mt-4 text-center">
          <Link to="/reset-password">Reset Password</Link>
        </div>
        <div className="mt-4 text-center">
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </Container>
  );
}

export default Login;
